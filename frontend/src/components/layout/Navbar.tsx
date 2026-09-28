import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { scrollToTarget } from '../../hooks/useLenis';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isProblems = location.pathname.startsWith('/problems');
  const isTopics = location.pathname.startsWith('/topics');

  useEffect(() => {
    const handleScroll = () => {
      // Transition to full-width translucent glass when scroll exceeds 40–60px
      setScrolled(window.scrollY > 48);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      scrollToTarget(id, { offset: -20 });
      return;
    }
    navigate(`/#${id}`);
    setTimeout(() => {
      scrollToTarget(id, { offset: -20 });
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'bg-[rgba(12,12,15,0.72)] backdrop-blur-[14px] border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-b border-transparent shadow-none backdrop-blur-none'
      }`}
    >
      <nav
        aria-label="Main Navigation"
        className="w-full max-w-5xl lg:max-w-6xl mx-auto h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between"
      >
        {/* Desktop Balanced 3-Zone Grid Layout */}
        <div className="hidden md:grid grid-cols-[160px_1fr_160px] items-center w-full">
          {/* 1. Left: Brand Anchor */}
          <div className="flex items-center justify-start">
            <Link
              to="/"
              onClick={() => {
                if (isHome) {
                  scrollToTarget(0);
                }
              }}
              className="flex items-center group/brand focus:outline-none"
            >
              <span className="font-sans font-bold text-sm tracking-[0.2em] text-white transition-opacity group-hover/brand:opacity-80">
                DEV.LAB
              </span>
            </Link>
          </div>

          {/* 2. Center: Coherently Grouped Navigation Links */}
          <div className="flex items-center justify-center gap-5 lg:gap-7 text-xs font-mono tracking-wider">
            <Link
              to="/"
              onClick={() => {
                if (isHome) {
                  scrollToTarget(0);
                }
              }}
              className={`transition-colors duration-200 py-1 ${
                isHome ? 'text-white font-medium' : 'text-[#8a8a8a] hover:text-white'
              }`}
            >
              HOME
            </Link>

            <Link
              to="/problems"
              className={`transition-colors duration-200 py-1 ${
                isProblems ? 'text-white font-medium' : 'text-[#8a8a8a] hover:text-white'
              }`}
            >
              PROBLEMS
            </Link>

            <Link
              to="/topics"
              className={`transition-colors duration-200 py-1 ${
                isTopics ? 'text-white font-medium' : 'text-[#8a8a8a] hover:text-white'
              }`}
            >
              TOPICS
            </Link>

            <button
              onClick={() => scrollToSection('journey')}
              className="text-[#8a8a8a] hover:text-white transition-colors duration-200 py-1 cursor-pointer"
            >
              JOURNEY
            </button>

            <a
              href="https://github.com/papneetswain4-alt/dev-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8a8a8a] hover:text-white transition-colors duration-200 py-1 inline-flex items-center gap-1"
            >
              <span>GITHUB</span>
              <ArrowUpRight size={11} className="opacity-70" />
            </a>
          </div>

          {/* 3. Right: Secondary Explore Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => scrollToSection('problems')}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono tracking-wider text-[#9a9a9a] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>EXPLORE</span>
              <ChevronDown size={11} className="text-[#6f6f6f]" />
            </button>
          </div>
        </div>

        {/* Mobile Compact Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link
            to="/"
            onClick={() => {
              if (isHome) {
                scrollToTarget(0);
              }
            }}
            className="flex items-center group/brand focus:outline-none"
          >
            <span className="font-sans font-bold text-sm tracking-[0.2em] text-white">
              DEV.LAB
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Glass Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl pointer-events-auto flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
          {/* Top Bar with Brand & Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="font-sans font-bold text-base tracking-[0.22em] text-white">
              DEV.LAB
            </span>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-[#9a9a9a] hover:text-white border border-white/10 transition-colors"
              aria-label="Close Menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Links - Editorial Typography */}
          <div className="flex flex-col gap-6 my-auto">
            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-baseline justify-between text-left py-2 border-b border-white/5"
            >
              <span className="font-display text-4xl sm:text-5xl text-white group-hover:text-white/80 transition-colors">
                Index
              </span>
              <span className="font-mono text-xs text-[#6f6f6f]">01</span>
            </Link>

            <Link
              to="/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-baseline justify-between text-left py-2 border-b border-white/5"
            >
              <span className="font-display text-4xl sm:text-5xl text-white group-hover:text-white/80 transition-colors">
                Problems
              </span>
              <span className="font-mono text-xs text-[#6f6f6f]">02</span>
            </Link>

            <Link
              to="/topics"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-baseline justify-between text-left py-2 border-b border-white/5"
            >
              <span className="font-display text-4xl sm:text-5xl text-white group-hover:text-white/80 transition-colors">
                Topics &amp; Patterns
              </span>
              <span className="font-mono text-xs text-[#6f6f6f]">03</span>
            </Link>

            <button
              onClick={() => scrollToSection('journey')}
              className="group flex items-baseline justify-between text-left py-2 border-b border-white/5 cursor-pointer"
            >
              <span className="font-display text-4xl sm:text-5xl text-white group-hover:text-white/80 transition-colors">
                Journey
              </span>
              <span className="font-mono text-xs text-[#6f6f6f]">04</span>
            </button>

            <a
              href="https://github.com/papneetswain4-alt/dev-lab"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-baseline justify-between text-left py-2 border-b border-white/5"
            >
              <span className="font-display text-4xl sm:text-5xl text-white group-hover:text-white/80 transition-colors">
                GitHub Repository
              </span>
              <ArrowUpRight size={20} className="text-[#6f6f6f]" />
            </a>
          </div>

          {/* Bottom Action */}
          <div className="pt-4">
            <button
              onClick={() => scrollToSection('problems')}
              className="w-full metallic-btn-primary py-3.5 text-xs font-mono tracking-widest uppercase cursor-pointer"
            >
              Explore Solutions &darr;
            </button>
            <p className="font-mono text-[10px] text-[#6f6f6f] text-center mt-3 tracking-widest uppercase">
              Dev.Lab &bull; Automated via LeetHub Neo
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
