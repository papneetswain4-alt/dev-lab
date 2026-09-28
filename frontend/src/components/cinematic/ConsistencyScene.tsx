import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal } from 'lucide-react';
import type { Summary } from '../../types/dsa';
import { AsciiImageTexture } from './AsciiImageTexture';

gsap.registerPlugin(ScrollTrigger);

interface ConsistencySceneProps {
  summary: Summary;
}

interface CalendarDay {
  iso: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  month: number;
  day: number;
  year: number;
}


function formatFullDate(iso: string): string {
  const [yearStr, monthStr, dayStr] = iso.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const mIdx = Math.max(0, Math.min(11, parseInt(monthStr, 10) - 1));
  const monthName = monthNames[mIdx] || monthStr;
  const dayNum = parseInt(dayStr, 10);
  return `${monthName} ${dayNum}, ${yearStr}`;
}

export const ConsistencyScene: React.FC<ConsistencySceneProps> = ({ summary }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metricsBoxRef = useRef<HTMLDivElement>(null);
  const heatmapCardRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);

  // Scroll-controlled live counter state
  const [displayDays, setDisplayDays] = useState(0);
  const [displayStreak, setDisplayStreak] = useState(0);
  const [displaySubmissions, setDisplaySubmissions] = useState(0);

  const activity = summary.activity || [];

  // Map date -> count
  const { activityMap, totalSubmissions, latestDateIso } = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;
    let latest = activity.find((item) => Boolean(item.date))?.date || new Date().toISOString().slice(0, 10);

    for (const item of activity) {
      if (!item.date) continue;
      map.set(item.date, item.count);
      total += item.count;
      if (item.date > latest) {
        latest = item.date;
      }
    }

    return { activityMap: map, totalSubmissions: total || summary.total, latestDateIso: latest };
  }, [activity, summary.total]);

  // Generate 53-week rolling calendar
  const { weeks, monthByWeek } = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [ly, lm, ld] = latestDateIso.split('-').map(Number);
    const endDate = new Date(Date.UTC(ly, lm - 1, ld));

    const dayOfWeek = endDate.getUTCDay();
    const daysToAdd = (7 - dayOfWeek) % 7;
    const calendarEnd = new Date(endDate.getTime() + daysToAdd * 86400000);

    const totalDays = 53 * 7;
    const calendarStart = new Date(calendarEnd.getTime() - (totalDays - 1) * 86400000);

    const weeksList: CalendarDay[][] = [];
    const monthMap = new Map<number, string>();
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        const current = new Date(calendarStart.getTime() + (w * 7 + d) * 86400000);
        const iso = current.toISOString().slice(0, 10);
        const month = current.getUTCMonth();
        const day = current.getUTCDate();
        const year = current.getUTCFullYear();

        const count = activityMap.get(iso) || 0;
        let intensity: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 4) intensity = 4;
        else if (count === 3) intensity = 3;
        else if (count === 2) intensity = 2;
        else if (count === 1) intensity = 1;

        week.push({ iso, count, intensity, month, day, year });

        if (d === 0 && month !== lastMonth) {
          monthMap.set(w, monthNames[month]);
          lastMonth = month;
        }
      }
      weeksList.push(week);
    }

    return { weeks: weeksList, monthByWeek: monthMap };
  }, [activityMap, latestDateIso]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setDisplayDays(summary.activeDays);
      setDisplayStreak(summary.bestStreak);
      setDisplaySubmissions(totalSubmissions);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. SCROLL-CONTROLLED NUMERICAL COUNTERS (Tied to scroll progress; reverses on scroll up)
      const counterTarget = {
        days: 0,
        streak: 0,
        subs: 0,
      };

      gsap.to(counterTarget, {
        days: summary.activeDays,
        streak: summary.bestStreak,
        subs: totalSubmissions,
        ease: 'none',
        scrollTrigger: {
          trigger: metricsBoxRef.current,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1,
          onUpdate: () => {
            setDisplayDays(Math.round(counterTarget.days));
            setDisplayStreak(Math.round(counterTarget.streak));
            setDisplaySubmissions(Math.round(counterTarget.subs));
          },
        },
      });

      // 2. PROGRESSIVE HEATMAP REVEAL
      gsap.fromTo(
        heatmapCardRef.current,
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heatmapCardRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [summary.activeDays, summary.bestStreak, totalSubmissions]);

  // Metallic monochrome intensity classes
  const getCellClasses = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.9)]';
      case 3:
        return 'bg-white/80 border-white/90 shadow-[0_0_4px_rgba(255,255,255,0.4)]';
      case 2:
        return 'bg-white/50 border-white/60';
      case 1:
        return 'bg-white/25 border-white/30';
      default:
        return 'bg-white/[0.03] border-white/[0.04] hover:border-white/20';
    }
  };

  return (
    <section
      id="consistency"
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20 scroll-mt-16"
    >
      <div ref={headlineRef} className="mb-14 sm:mb-18">
        <h2 className="font-sans font-light text-5xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-[0.92] max-w-4xl">
          Consistency{' '}
          <span className="font-italic-serif text-white/90 lowercase tracking-normal">
            is a
          </span>
          <br />
          system.
        </h2>

        <p className="text-[#9a9a9a] text-sm sm:text-base md:text-lg max-w-2xl mt-6 font-sans font-light leading-relaxed">
          Problem solving is not an event; it is an ongoing temporal signal. Verified LeetCode submissions synchronized automatically into an immutable calendar matrix.
        </p>
      </div>

      {/* 2. SCROLL-DRIVEN METRIC COUNTERS (Scrubbed by scroll position) */}
      <div
        ref={metricsBoxRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-14 select-none"
      >
        <div className="relative overflow-hidden group cinematic-panel p-6 sm:p-7 rounded-2xl border border-white/10">
          <AsciiImageTexture
            texture="texture-02"
            crop="top-right"
            fade="corner-tr"
            dotSpacing={5.8}
            density={1.05}
            detail={1.15}
            contrast={1.38}
            opacity={0.34}
            hoverOpacity={0.60}
          />
          <div className="relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#6f6f6f] block mb-2">
              ACTIVE CALENDAR DAYS
            </span>
            <div className="font-sans text-5xl sm:text-6xl font-bold tracking-tight text-white tabular-nums">
              {displayDays}
            </div>
            <span className="font-mono text-xs text-[#9a9a9a] mt-2 block">
              Dedicated problem-solving sessions
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden group cinematic-panel p-6 sm:p-7 rounded-2xl border border-white/10">
          <AsciiImageTexture
            texture="texture-01"
            crop="center"
            fade="radial"
            dotSpacing={5.8}
            density={1.05}
            detail={1.15}
            contrast={1.38}
            opacity={0.34}
            hoverOpacity={0.60}
          />
          <div className="relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#6f6f6f] block mb-2">
              CONSECUTIVE BEST STREAK
            </span>
            <div className="font-sans text-5xl sm:text-6xl font-bold tracking-tight text-white flex items-baseline gap-2 tabular-nums">
              <span>{displayStreak}</span>
              <span className="text-xl font-normal text-[#9a9a9a]">DAYS</span>
            </div>
            <span className="font-mono text-xs text-[#9a9a9a] mt-2 block">
              Peak sustained momentum run
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden group cinematic-panel p-6 sm:p-7 rounded-2xl border border-white/10">
          <AsciiImageTexture
            texture="texture-04"
            crop="bottom-right"
            fade="corner-br"
            dotSpacing={5.8}
            density={1.05}
            detail={1.15}
            contrast={1.38}
            opacity={0.34}
            hoverOpacity={0.60}
          />
          <div className="relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#6f6f6f] block mb-2">
              TOTAL SUBMISSIONS RECORDED
            </span>
            <div className="font-sans text-5xl sm:text-6xl font-bold tracking-tight text-white tabular-nums">
              {displaySubmissions}
            </div>
            <span className="font-mono text-xs text-[#9a9a9a] mt-2 block">
              Logged in rolling activity ledger
            </span>
          </div>
        </div>
      </div>

      {/* 3. PROGRESSIVE HEATMAP CARD */}
      <div
        ref={heatmapCardRef}
        className="relative overflow-hidden group cinematic-panel p-6 sm:p-10 rounded-2xl border border-white/10 transition-all duration-300"
      >
        <AsciiImageTexture
          texture="texture-02"
          crop="top-right"
          fade="to-t"
          dotSpacing={6.0}
          density={1.0}
          detail={1.10}
          contrast={1.35}
          opacity={0.24}
          hoverOpacity={0.42}
        />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-white/80" />
              <span className="font-mono text-xs uppercase tracking-widest text-white">
                Submission Matrix &bull; 53-Week Ledger
              </span>
            </div>

          {/* Interactive Inspection readout */}
          <div className="font-mono text-xs text-[#9a9a9a] min-h-[20px]">
            {hoveredDay ? (
              <span className="text-white animate-in fade-in duration-100">
                <strong className="text-white font-semibold">{formatFullDate(hoveredDay.iso)}</strong>: {hoveredDay.count === 0 ? '0 problems' : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'problem' : 'problems'} solved`}
              </span>
            ) : (
              <span className="text-[#6f6f6f] italic">Hover any date to inspect details</span>
            )}
          </div>
        </div>

        {/* Mathematically Aligned Scrollable Grid Container */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="min-w-[760px] flex flex-col mx-auto w-fit">
            {/* Months Header Row: Shared column width with exact column index alignment */}
            <div className="flex gap-1 mb-2 select-none">
              {/* Leading spacer for Day labels column */}
              <div className="w-7 sm:w-8 shrink-0" />

              {/* 53 Columns Header */}
              <div className="flex gap-[3px] sm:gap-1">
                {weeks.map((_, wIdx) => (
                  <div key={wIdx} className="w-2.5 sm:w-3 shrink-0 relative h-4 overflow-visible">
                    {monthByWeek.has(wIdx) && (
                      <span className="absolute left-0 top-0 text-[10px] font-mono text-[#8a8a8a] uppercase tracking-wider whitespace-nowrap">
                        {monthByWeek.get(wIdx)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Calendar Grid: Day labels + 53 Week Columns */}
            <div className="flex gap-1">
              {/* Day Labels Column: Aligned row by row with cell heights */}
              <div className="w-7 sm:w-8 shrink-0 flex flex-col gap-[3px] sm:gap-1 text-[9px] font-mono text-[#6f6f6f] select-none pr-1.5">
                <div className="h-2.5 sm:h-3 flex items-center leading-none">Mon</div>
                <div className="h-2.5 sm:h-3" />
                <div className="h-2.5 sm:h-3 flex items-center leading-none">Wed</div>
                <div className="h-2.5 sm:h-3" />
                <div className="h-2.5 sm:h-3 flex items-center leading-none">Fri</div>
                <div className="h-2.5 sm:h-3" />
                <div className="h-2.5 sm:h-3" />
              </div>

              {/* 53 Week Columns */}
              <div className="flex gap-[3px] sm:gap-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="w-2.5 sm:w-3 shrink-0 flex flex-col gap-[3px] sm:gap-1">
                    {week.map((day) => {
                      const isHovered = hoveredDay?.iso === day.iso;
                      return (
                        <div
                          key={day.iso}
                          tabIndex={0}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onFocus={() => setHoveredDay(day)}
                          onBlur={() => setHoveredDay(null)}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border transition-all duration-100 cursor-pointer ${getCellClasses(
                            day.intensity
                          )} ${
                            isHovered ? 'scale-125 z-10 !border-white shadow-[0_0_8px_white]' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5 font-mono text-xs text-[#6f6f6f]">
          <span>Synced directly via LeetHub Neo</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider">LESS</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-white/[0.03] border border-white/[0.04]" />
              <span className="w-2.5 h-2.5 rounded-xs bg-white/25 border border-white/30" />
              <span className="w-2.5 h-2.5 rounded-xs bg-white/50 border border-white/60" />
              <span className="w-2.5 h-2.5 rounded-xs bg-white/80 border border-white/90" />
              <span className="w-2.5 h-2.5 rounded-xs bg-white border-white shadow-[0_0_6px_white]" />
            </div>
            <span className="text-[10px] uppercase tracking-wider">MORE</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
