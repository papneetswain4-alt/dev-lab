import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CinematicBackground } from './CinematicBackground';
import { FilmGrain } from './FilmGrain';
import { Navbar } from './Navbar';
import { DotAsciiBackground } from '../cinematic/DotAsciiBackground';
import { resetAsciiMorphProgress } from '../../services/asciiBackgroundController';
import { useLenis } from '../../hooks/useLenis';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  // Initialize Lenis smooth scroll coordinated with GSAP ScrollTrigger
  useLenis();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Ensure default SPACE state whenever outside the home cinematic sequence
  useEffect(() => {
    if (!isHome) {
      resetAsciiMorphProgress();
    }
  }, [isHome]);

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col selection:bg-white/20 selection:text-white">
      {/* Global Cinematic Architectural Background */}
      <CinematicBackground />

      {/* Global Persistent High-Detail Dot ASCII Canvas */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <DotAsciiBackground
          opacity={0.52}
          brightness={1.05}
          contrast={1.22}
          motionIntensity={0.8}
          displacementIntensity={0.7}
          ambientMotion={true}
          ambientIntensity={0.9}
          interactive={true}
        />
      </div>

      {/* Global Tactile Film Grain */}
      <FilmGrain />

      {/* Persistent Navigation */}
      <Navbar />

      {/* Application Route Content — Home starts at top 0; subpages have breathing room below fixed nav */}
      <div className={`relative z-10 flex-1 flex flex-col ${isHome ? '' : 'pt-20 sm:pt-24'}`}>
        {children}
      </div>
    </div>
  );
};

