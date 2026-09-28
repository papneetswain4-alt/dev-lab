/**
 * Global controller for the persistent Dot ASCII Background engine.
 * Allows the Home cinematic GSAP ScrollTrigger timeline to scrub the morph
 * progress directly at 60/120 FPS with ZERO React re-renders.
 */
export const asciiMorphProgress = {
  current: 0,
};

/**
 * Resets the background to default SPACE state (e.g. on route navigation away from cinematic hero).
 */
export function resetAsciiMorphProgress(): void {
  asciiMorphProgress.current = 0;
}
