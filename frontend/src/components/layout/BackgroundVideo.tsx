import React, { useEffect, useRef } from 'react';

const VIDEO_SRC = '/videos/dev-lab-background.mp4';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Respect user's reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      if (!videoRef.current) return;
      if (e.matches) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
        });
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Persistent Looping Viewport Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        className="w-full h-full object-cover"
        src={VIDEO_SRC}
      />

      {/* Subtle readability treatment - does not hide or overpower the video */}
      <div className="absolute inset-0 bg-[#010828]/25 pointer-events-none" />
    </div>
  );
};
