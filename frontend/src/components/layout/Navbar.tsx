import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isProblems = location.pathname.startsWith('/problems');
  const isTopics = location.pathname.startsWith('/topics');

  const scrollToSection = (id: string) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${id}`);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBeginJourney = () => {
    scrollToSection('problems');
  };

  return (
    <header className="relative z-20 w-full pt-4 sm:pt-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <nav
        aria-label="Main Navigation"
        className="w-full liquid-glass rounded-2xl sm:rounded-[22px] border border-white/10 backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-3.5">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="font-display text-2xl sm:text-[26px] tracking-wider text-foreground hover:opacity-90 transition-opacity select-none"
          >
            DEV.LAB
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium">
            <Link
              to="/"
              onClick={() => {
                if (isHome) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`transition-colors duration-200 ${
                isHome
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:text-neon-accent'
              }`}
            >
              Home
            </Link>

            <Link
              to="/problems"
              className={`transition-colors duration-200 ${
                isProblems
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:text-neon-accent'
              }`}
            >
              Problems
            </Link>

            <Link
              to="/topics"
              className={`transition-colors duration-200 ${
                isTopics
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:text-neon-accent'
              }`}
            >
              Topics
            </Link>

            <button
              onClick={() => scrollToSection('journey')}
              className="text-muted-foreground hover:text-foreground hover:text-neon-accent transition-colors duration-200 cursor-pointer"
            >
              Journey
            </button>

            <a
              href="https://github.com/papneetswain4-alt/dev-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground hover:text-neon-accent transition-colors duration-200"
            >
              GitHub
            </a>
          </div>

          {/* Desktop CTA (Outlined subtle liquid-glass pill) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleBeginJourney}
              className="liquid-glass rounded-full border border-white/15 hover:border-neon-accent/60 px-5 py-2 text-xs font-mono tracking-wider text-foreground hover:text-neon-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              BEGIN JOURNEY &darr;
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden liquid-glass p-2 rounded-xl text-foreground hover:text-white transition-colors border border-white/10"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown inside the floating liquid-glass panel */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-5 pt-3 border-t border-white/10 mt-1">
            <div className="flex flex-col gap-3 text-center">
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isHome) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`py-2 text-sm transition-colors ${
                  isHome ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Home
              </Link>

              <Link
                to="/problems"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm transition-colors ${
                  isProblems ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Problems
              </Link>

              <Link
                to="/topics"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-sm transition-colors ${
                  isTopics ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Topics
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('journey');
                }}
                className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Journey
              </button>

              <a
                href="https://github.com/papneetswain4-alt/dev-lab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleBeginJourney();
                  }}
                  className="w-full liquid-glass rounded-full border border-white/15 hover:border-neon-accent/60 py-2.5 text-xs font-mono tracking-wider text-foreground hover:text-neon-accent transition-all active:scale-[0.98] cursor-pointer"
                >
                  BEGIN JOURNEY &darr;
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
