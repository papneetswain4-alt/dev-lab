import React from 'react';

/**
 * Minimal, high-performance cinematic backdrop.
 * Replaces the old 14MB blue video with a pure black, architectural monochrome background
 * featuring subtle atmospheric gradients, fine coordinate grid lines, and soft spatial depth.
 */
export const CinematicBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-black"
      aria-hidden="true"
    >
      {/* Subtle Top Atmospheric Radial Glow */}
      <div 
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full opacity-40 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, rgba(120, 120, 120, 0.03) 45%, transparent 70%)',
        }}
      />

      {/* Subtle Mid-page Ambient Atmospheric Center Orb */}
      <div 
        className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-20 blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
        }}
      />

      {/* Faint Architectural Coordinate Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 30%, transparent 85%)',
        }}
      />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/80 pointer-events-none" />
    </div>
  );
};
