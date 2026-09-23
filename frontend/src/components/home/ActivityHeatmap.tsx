import React, { useState, useMemo } from 'react';
import { Calendar, Terminal } from 'lucide-react';
import type { ActivityDay } from '../../types/dsa';

interface ActivityHeatmapProps {
  activity: ActivityDay[];
  activeDays: number;
  totalSolved: number;
}

interface CalendarDay {
  iso: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  month: number;
  day: number;
  year: number;
}

interface MonthMarker {
  weekIndex: number;
  label: string;
}

/**
 * Calendar-safe date formatter that avoids any UTC timezone offsets.
 */
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

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  activity,
  activeDays,
  totalSolved,
}) => {
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);

  // Map of date (YYYY-MM-DD) -> problem count
  const { activityMap, totalSubmissions, latestDateIso } = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;
    let latest = activity.find(item => Boolean(item.date))?.date || new Date().toISOString().slice(0, 10);

    for (const item of activity) {
      if (!item.date) continue;
      map.set(item.date, item.count);
      total += item.count;
      if (item.date > latest) {
        latest = item.date;
      }
    }

    return { activityMap: map, totalSubmissions: total, latestDateIso: latest };
  }, [activity]);

  // Generate 53-week rolling calendar ending on the Sunday following latestDateIso
  const { weeks, monthMarkers } = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [ly, lm, ld] = latestDateIso.split('-').map(Number);
    const endDate = new Date(Date.UTC(ly, lm - 1, ld));

    // Align to Sunday at end of week (Monday = 1 ... Sunday = 0 in JS Date)
    const dayOfWeek = endDate.getUTCDay();
    const daysToAdd = (7 - dayOfWeek) % 7;
    const calendarEnd = new Date(endDate.getTime() + daysToAdd * 86400000);

    // 53 weeks = 371 days
    const totalDays = 53 * 7;
    const calendarStart = new Date(calendarEnd.getTime() - (totalDays - 1) * 86400000);

    const weeksList: CalendarDay[][] = [];
    const markers: MonthMarker[] = [];
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

        // Place month marker on the first week containing that month
        if (d === 0 && month !== lastMonth) {
          markers.push({ weekIndex: w, label: monthNames[month] });
          lastMonth = month;
        }
      }
      weeksList.push(week);
    }

    return { weeks: weeksList, monthMarkers: markers };
  }, [activityMap, latestDateIso]);

  // Intensity color token utility
  const getCellClasses = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-neon-accent border-neon-accent shadow-[0_0_8px_#6FFF00] ring-1 ring-neon-accent/60';
      case 3:
        return 'bg-neon-accent/80 border-neon-accent/90';
      case 2:
        return 'bg-neon-accent/50 border-neon-accent/60';
      case 1:
        return 'bg-neon-accent/25 border-neon-accent/35';
      default:
        return 'bg-white/[0.04] border-white/[0.04] hover:border-white/20';
    }
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 relative overflow-hidden">
      {/* Heatmap Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={15} className="text-neon-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-neon-accent font-semibold">
              ACTIVITY LEDGER &bull; 1-YEAR SIGNAL
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight">
            Submission Consistency
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm font-body mt-1 max-w-xl">
            A rolling contribution calendar reflecting verified problem-solving sessions synced from LeetCode.
          </p>
        </div>

        {/* Live Metrics Counters */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground self-start md:self-auto">
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="text-foreground font-semibold">{totalSolved}</span>
            <span>solved</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="text-foreground font-semibold">{totalSubmissions}</span>
            <span>submissions</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="text-foreground font-semibold">{activeDays}</span>
            <span>active days</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="text-neon-accent font-semibold">{activity.length}</span>
            <span>session dates</span>
          </div>
        </div>
      </div>

      {/* Heatmap Interactive Inspection Bar */}
      <div className="min-h-[28px] mb-4 flex items-center justify-between font-mono text-xs text-muted-foreground px-1">
        {hoveredDay ? (
          <div className="flex items-center gap-2 text-foreground animate-in fade-in duration-150">
            <span className="w-2 h-2 rounded-full bg-neon-accent shadow-[0_0_6px_#6FFF00]" />
            <span className="font-semibold text-neon-accent">
              {formatFullDate(hoveredDay.iso)}:
            </span>
            <span>
              {hoveredDay.count === 0
                ? 'No problems solved'
                : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'problem' : 'problems'} solved`}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 italic">
            Hover or tap any day to inspect historical session details
          </span>
        )}
      </div>

      {/* Contribution Calendar Scrollable Container (overflow-x-auto ensures mobile responsiveness without page overflow) */}
      <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
        <div className="min-w-[780px]">
          {/* Month Labels Header */}
          <div className="flex text-[10px] font-mono text-muted-foreground/75 mb-2 pl-7 relative h-4">
            {monthMarkers.map((marker, idx) => (
              <span
                key={idx}
                className="absolute uppercase tracking-wider"
                style={{ left: `${marker.weekIndex * 15 + 28}px` }}
              >
                {marker.label}
              </span>
            ))}
          </div>

          {/* Grid with Weekday Labels on Left */}
          <div className="flex gap-1.5">
            {/* Weekday indicators (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-muted-foreground/50 pr-1 select-none pt-0.5 pb-0.5 w-6 h-[105px]">
              <span>Mon</span>
              <span className="opacity-0">Tue</span>
              <span>Wed</span>
              <span className="opacity-0">Thu</span>
              <span>Fri</span>
              <span className="opacity-0">Sat</span>
              <span className="opacity-0">Sun</span>
            </div>

            {/* 53-week columns */}
            <div
              className="flex gap-1"
              role="grid"
              aria-label="Annual Contribution Calendar"
            >
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1" role="row">
                  {week.map((day) => {
                    const isHovered = hoveredDay?.iso === day.iso;
                    const tooltipText = `${formatFullDate(day.iso)}: ${
                      day.count === 0
                        ? 'No problems solved'
                        : `${day.count} ${day.count === 1 ? 'problem' : 'problems'} solved`
                    }`;

                    return (
                      <div
                        key={day.iso}
                        role="gridcell"
                        tabIndex={0}
                        aria-label={tooltipText}
                        title={tooltipText}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onFocus={() => setHoveredDay(day)}
                        onBlur={() => setHoveredDay(null)}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neon-accent ${getCellClasses(
                          day.intensity
                        )} ${
                          isHovered ? 'scale-125 z-10 !border-white shadow-[0_0_10px_#6FFF00]' : ''
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

      {/* Heatmap Legend & Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-white/5 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-neon-accent" />
          <span>Rolling 53-week submission record</span>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-muted-foreground/70">
            LESS
          </span>
          <div className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-white/[0.04] border border-white/[0.04]"
              title="0 problems"
            />
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-neon-accent/25 border border-neon-accent/35"
              title="1 problem"
            />
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-neon-accent/50 border border-neon-accent/60"
              title="2 problems"
            />
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-neon-accent/80 border border-neon-accent/90"
              title="3 problems"
            />
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-neon-accent border border-neon-accent shadow-[0_0_8px_#6FFF00]"
              title="4+ problems"
            />
          </div>
          <span className="text-[10px] tracking-wider uppercase text-muted-foreground/70">
            MORE
          </span>
        </div>
      </div>
    </div>
  );
};
