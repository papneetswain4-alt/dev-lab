import React from 'react';
import { Link } from 'react-router-dom';

export const HomeFooter: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="font-display text-2xl tracking-wider text-foreground">
            DEV.LAB
          </span>
          <p className="text-muted-foreground text-xs font-body mt-1">
            Where logic meets persistence. Papneet's algorithmic laboratory.
          </p>
        </div>

        {/* Quick Nav Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Home
          </button>
          <Link to="/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <button
            onClick={() => scrollToSection('topics')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Topics
          </button>
          <button
            onClick={() => scrollToSection('journey')}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Journey
          </button>
          <a
            href="https://github.com/papneetswain4-alt/dev-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>

        <div className="font-mono text-[11px] text-muted-foreground/60">
          Sync automated via LeetHub Neo
        </div>
      </div>
    </footer>
  );
};
