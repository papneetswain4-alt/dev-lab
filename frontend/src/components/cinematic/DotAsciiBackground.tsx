import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { asciiMorphProgress } from '../../services/asciiBackgroundController';

export const DEFAULT_MORPH_IMAGES = [
  '/images/space.jpeg',                  // 0: SPACE (Opening hero atmosphere)
  '/images/flower.jpeg',                 // 1: FLOWER (BUILD)
  '/images/person.jpeg',                 // 2: PERSON (SOLVE)
  '/images/water.jpeg',                  // 3: WATER (LEARN)
  '/images/%D0%A1%D0%B0%D0%BC.jpeg',     // 4: LANDSCAPE (REPEAT & achievement destination)
  '/images/space.jpeg',                  // 5: SPACE (Smoothly restored persistent global state)
];

export interface DotAsciiBackgroundProps {
  /** Array of image URLs for scroll morphing (defaults to Dev.Lab 6-stage cycle ending in restored SPACE) */
  images?: string[];
  /** Single image source for static/single-scene usage */
  src?: string;
  /** Morph progress between 0 and images.length - 1 */
  morphProgress?: number;
  /** Optional mutable ref for 60/120 FPS GSAP scrubbing without triggering React re-renders */
  morphProgressRef?: React.MutableRefObject<number>;
  /** Grid dot spacing in pixels (defaults to high-detail: 8px desktop, 10px tablet, 12.5px mobile) */
  dotSpacing?: number;
  /** Overall brightness multiplier (default: 1.0) */
  brightness?: number;
  /** Contrast adjustment multiplier (default: 1.25) */
  contrast?: number;
  /** Global layer opacity (default: 0.52 for optimal contrast against all routes and text) */
  opacity?: number;
  /** Live motion wave intensity (default: 1.0) */
  motionIntensity?: number;
  /** Displacement distance multiplier during live breathing and morph travel (default: 1.0) */
  displacementIntensity?: number;
  /** Enable living landscape ambient atmospheric animation on stage 4 (default: true) */
  ambientMotion?: boolean;
  /** Ambient motion intensity multiplier (default: 1.0) */
  ambientIntensity?: number;
  /** Enable mouse/cursor interactive wave (default: true) */
  interactive?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline CSS styles */
  style?: React.CSSProperties;
}

interface GridPoint {
  c: number;
  r: number;
  cellIndex: number;
  baseX: number;
  baseY: number;
  phase: number;
  landscapeBrightness: number;
}

interface TierConfig {
  fontSize: number;
  fillStyle: string;
}

// In-memory image cache to prevent redundant network fetches and decoding
const imageCache = new Map<string, HTMLImageElement>();

function loadCachedImage(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn(`[DotAsciiBackground] Failed to load image: ${url}`, err);
      reject(err);
    };
  });
}

/**
 * DotAsciiBackground — Stage 3: Persistent Global High-Detail Dot ASCII Background
 * 
 * Reconstructs local images entirely out of the single character: '.'
 * Uses high-detail 8px sampling and pre-calculated luminance grids for 60+ FPS performance.
 * Supports scroll-controlled morphing across SPACE -> FLOWER -> PERSON -> WATER -> LANDSCAPE -> SPACE
 * and remains mounted continuously as the global ambient background across all application routes.
 */
export const DotAsciiBackground: React.FC<DotAsciiBackgroundProps> = ({
  images,
  src,
  morphProgress = 0,
  morphProgressRef = asciiMorphProgress,
  dotSpacing,
  brightness = 1.0,
  contrast = 1.25,
  opacity = 0.52,
  motionIntensity = 1.0,
  displacementIntensity = 1.0,
  ambientMotion = true,
  ambientIntensity = 1.0,
  interactive = true,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isReduced = useReducedMotion();

  // Resolved list of images
  const resolvedImages = useRef<string[]>(
    images && images.length > 0
      ? images
      : src
      ? [src]
      : DEFAULT_MORPH_IMAGES
  );

  useEffect(() => {
    if (images && images.length > 0) {
      resolvedImages.current = images;
    } else if (src) {
      resolvedImages.current = [src];
    } else {
      resolvedImages.current = DEFAULT_MORPH_IMAGES;
    }
  }, [images, src]);

  // Internal animation & tracking references
  const sampledGridsRef = useRef<Float32Array[]>([]);
  const pointsRef = useRef<GridPoint[]>([]);
  const gridDimensionsRef = useRef<{ cols: number; rows: number }>({ cols: 0, rows: 0 });
  const rafIdRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const targetMousePosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const mouseActiveRef = useRef<boolean>(false);
  const currentDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Generate 6 distinct optical tiers for high-detail, fine-grain pointillist representation
  const opScale = opacity / 0.52;
  const tiers: TierConfig[] = [
    // Tier 0: Faint cosmic dust / deep shadow mist
    { fontSize: 5.0, fillStyle: `rgba(130, 135, 150, ${Math.min(1, 0.16 * opScale)})` },
    // Tier 1: Soft shadow contours
    { fontSize: 6.5, fillStyle: `rgba(160, 168, 185, ${Math.min(1, 0.30 * opScale)})` },
    // Tier 2: Lower midtones
    { fontSize: 8.0, fillStyle: `rgba(195, 205, 220, ${Math.min(1, 0.48 * opScale)})` },
    // Tier 3: Upper midtones
    { fontSize: 9.5, fillStyle: `rgba(225, 232, 245, ${Math.min(1, 0.68 * opScale)})` },
    // Tier 4: Crisp highlights
    { fontSize: 11.0, fillStyle: `rgba(245, 248, 255, ${Math.min(1, 0.85 * opScale)})` },
    // Tier 5: Stellar cores & crest peaks
    { fontSize: 12.5, fillStyle: `rgba(255, 255, 255, ${Math.min(1, 0.98 * opScale)})` },
  ];

  // Helper to determine tier from normalized brightness (6 levels for ultra-smooth gradients)
  const getTier = (b: number): number => {
    if (b < 0.18) return 0;
    if (b < 0.34) return 1;
    if (b < 0.52) return 2;
    if (b < 0.70) return 3;
    if (b < 0.86) return 4;
    return 5;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    const offscreenCanvas = document.createElement('canvas');
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    // 1. Resample all images onto compatible Float32Array grids at high resolution
    const sampleAllGrids = async () => {
      if (!canvas || !offCtx) return;
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === 0 || height === 0) return;

      currentDimensionsRef.current = { width, height };

      // High-detail responsive spacing:
      // Desktop (>= 1024px): 8px (sharp, detailed silhouette)
      // Tablet (640px - 1023px): 10px
      // Mobile (< 640px): 12.5px
      const spacing = dotSpacing || (width >= 1024 ? 8 : width >= 640 ? 10 : 12.5);
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      const totalCells = cols * rows;

      gridDimensionsRef.current = { cols, rows };
      offscreenCanvas.width = cols;
      offscreenCanvas.height = rows;

      const imgUrls = resolvedImages.current;
      const newGrids: Float32Array[] = [];

      for (let k = 0; k < imgUrls.length; k++) {
        const url = imgUrls[k];
        try {
          const img = await loadCachedImage(url);
          if (isDisposed) return;

          // Compute aspect-ratio cover crop
          const imgW = img.naturalWidth || 1920;
          const imgH = img.naturalHeight || 1080;
          const imgAspect = imgW / imgH;
          const gridAspect = cols / rows;

          let sx = 0;
          let sy = 0;
          let sw = imgW;
          let sh = imgH;

          if (gridAspect > imgAspect) {
            sh = imgW / gridAspect;
            sy = (imgH - sh) * 0.5;
          } else {
            sw = imgH * gridAspect;
            sx = (imgW - sw) * 0.5;
          }

          offCtx.clearRect(0, 0, cols, rows);
          offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

          const imgData = offCtx.getImageData(0, 0, cols, rows).data;
          const buffer = new Float32Array(totalCells);

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const idx = (r * cols + c) * 4;
              const red = imgData[idx];
              const green = imgData[idx + 1];
              const blue = imgData[idx + 2];

              // ITU-R BT.709 relative luminance
              const lum = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

              // Carefully calibrated contrast curve with gamma to preserve subtle midtones
              let b = Math.pow(lum, 1.15);
              b = (b - 0.5) * contrast + 0.5;
              b = Math.max(0, Math.min(1, b)) * brightness;

              // Soft radial edge vignette
              const normX = (c / cols - 0.5) * 2;
              const normY = (r / rows - 0.5) * 2;
              const edgeDist = Math.sqrt(normX * normX + normY * normY);
              const edgeVignette = Math.max(0, 1 - Math.pow(edgeDist / 1.35, 3));
              b *= edgeVignette;

              buffer[r * cols + c] = b;
            }
          }

          newGrids[k] = buffer;
        } catch (err) {
          console.warn(`[DotAsciiBackground] Failed sampling grid for ${url}:`, err);
          newGrids[k] = new Float32Array(totalCells);
        }
      }

      sampledGridsRef.current = newGrids;

      // Extract active points that have visible luminance in at least one image
      const landscapeIndex = Math.min(4, newGrids.length - 1);
      const landscapeGrid = newGrids[landscapeIndex];
      const newPoints: GridPoint[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellIndex = r * cols + c;
          let maxB = 0;
          for (let k = 0; k < newGrids.length; k++) {
            if (newGrids[k] && newGrids[k][cellIndex] > maxB) {
              maxB = newGrids[k][cellIndex];
            }
          }

          // Skip cells that are dark across all images (preserves dark negative space)
          if (maxB < 0.048) continue;

          newPoints.push({
            c,
            r,
            cellIndex,
            baseX: c * spacing + spacing * 0.5,
            baseY: r * spacing + spacing * 0.5,
            phase: (c * 0.22 + r * 0.35) % (Math.PI * 2),
            landscapeBrightness: landscapeGrid ? landscapeGrid[cellIndex] : 0,
          });
        }
      }

      pointsRef.current = newPoints;

      // Render immediately
      drawFrame(performance.now() * 0.001);
    };

    // 2. High-Performance Canvas Rendering with 6 Tiers and Living Ambient State
    // Flat number arrays for tier point batches: [x, y, x, y, ...]
    const tierBatches: number[][] = [[], [], [], [], [], []];

    const drawFrame = (time: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = currentDimensionsRef.current;
      if (width === 0 || height === 0) return;

      const grids = sampledGridsRef.current;
      if (grids.length === 0) return;

      const points = pointsRef.current;
      const { cols, rows } = gridDimensionsRef.current;

      // Read instantaneous progress (from GSAP ref or prop)
      const currentProg = morphProgressRef ? morphProgressRef.current : morphProgress;
      const maxIndex = grids.length - 1;
      const clampedProg = Math.max(0, Math.min(maxIndex, currentProg));

      // Calculate source and target image indices
      const stage = Math.floor(clampedProg);
      const fraction = clampedProg - stage;
      const baseIdx = Math.min(maxIndex, stage);
      const targetIdx = Math.min(maxIndex, baseIdx + (fraction > 0 ? 1 : 0));

      const gridA = grids[baseIdx];
      const gridB = grids[targetIdx];

      // Morph travel factor: 0 at exact image, peaks at 1.0 at midpoint (p = 0.5)
      const travelFactor = Math.sin(Math.PI * fraction);

      // Living Landscape Activation: active when settled on stage 4 (REPEAT)
      const landscapeWeight = ambientMotion && baseIdx === 4
        ? Math.max(0, 1 - fraction * 2.0)
        : 0;

      // Update smooth cursor lerp
      if (interactive && mouseActiveRef.current) {
        mousePosRef.current.x += (targetMousePosRef.current.x - mousePosRef.current.x) * 0.08;
        mousePosRef.current.y += (targetMousePosRef.current.y - mousePosRef.current.y) * 0.08;
      } else {
        mousePosRef.current.x += (-9999 - mousePosRef.current.x) * 0.08;
        mousePosRef.current.y += (-9999 - mousePosRef.current.y) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const curMouseX = mousePosRef.current.x;
      const curMouseY = mousePosRef.current.y;
      const interactiveActive = interactive && curMouseX > -500;
      const radius = 150;
      const radiusSq = radius * radius;

      // Clear tier batches
      for (let t = 0; t < 6; t++) {
        tierBatches[t].length = 0;
      }

      // Loop over points and bucket them
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const idx = p.cellIndex;

        const bA = gridA ? gridA[idx] : 0;
        const bB = gridB ? gridB[idx] : 0;

        // Continuous brightness interpolation
        let b = bA * (1 - fraction) + bB * fraction;

        // Subtle luminosity surge during flight
        if (travelFactor > 0.02) {
          b += travelFactor * 0.04 * Math.max(bA, bB);
        }

        // Living landscape subtle atmospheric light breathing
        if (landscapeWeight > 0.01 && !isReduced) {
          const lightAtmosphere = Math.sin(time * 0.42 + p.c * 0.048 + p.r * 0.032) * 0.04;
          const gentleShimmer = Math.cos(time * 0.72 + p.phase) * 0.02;
          b += (lightAtmosphere + gentleShimmer) * landscapeWeight * ambientIntensity;
        }

        // Cutoff for invisible dots (preserves dark negative space)
        if (b < 0.048) continue;

        const tier = getTier(b);

        if (isReduced) {
          tierBatches[tier].push(p.baseX, p.baseY);
          continue;
        }

        // 1. Base Organic Breathing Wave (subtle, coherent)
        const baseWaveX = Math.sin(time * 0.60 + p.phase) * 1.15 * displacementIntensity;
        const baseWaveY = Math.cos(time * 0.45 + p.phase * 1.25) * 1.15 * displacementIntensity;

        // 2. Living Dot Landscape Atmospheric Currents (when on Landscape stage)
        let finalWaveX = baseWaveX;
        let finalWaveY = baseWaveY;

        if (landscapeWeight > 0.01) {
          const normY = rows > 0 ? p.r / rows : 0.5;
          const airDrift = Math.sin(time * 0.32 + p.c * 0.045 + p.r * 0.055) * 1.6;
          const mountainBreeze = Math.cos(time * 0.26 + p.c * 0.065 - p.r * 0.038) * 1.1;
          const altitudeFactor = Math.max(0.35, 1.0 - normY * 0.45);
          const silhouetteAnchor = p.landscapeBrightness > 0.65 ? 0.48 : 1.0;

          const livingX = airDrift * altitudeFactor * silhouetteAnchor * displacementIntensity * ambientIntensity;
          const livingY = mountainBreeze * altitudeFactor * silhouetteAnchor * displacementIntensity * ambientIntensity;

          finalWaveX = baseWaveX * (1 - landscapeWeight) + livingX * landscapeWeight;
          finalWaveY = baseWaveY * (1 - landscapeWeight) + livingY * landscapeWeight;
        }

        // 3. Scroll-Scrubbed Morph Travel Displacement
        let morphX = 0;
        let morphY = 0;

        if (travelFactor > 0.001) {
          let dirX = 0;
          let dirY = 0;

          if (baseIdx === 0) {
            // SPACE -> FLOWER: Radial cosmic bloom & spiral expansion
            const angle = Math.atan2(p.r - rows * 0.5, p.c - cols * 0.5);
            const distNorm = Math.hypot(p.c - cols * 0.5, p.r - rows * 0.5) / (cols * 0.5 || 1);
            dirX = Math.cos(angle + 0.45) * (18 * distNorm) + (bB - bA) * 14;
            dirY = Math.sin(angle + 0.45) * (18 * distNorm) + (bB - bA) * 14;
          } else if (baseIdx === 1) {
            // FLOWER -> PERSON: Vertical aspiration & facial silhouette streaming
            const flowWave = Math.sin(p.r * 0.14 + p.c * 0.08);
            dirX = flowWave * 20 + (bB - bA) * 16;
            dirY = -Math.cos(p.c * 0.12) * 16 + (bB - bA) * 15;
          } else if (baseIdx === 2) {
            // PERSON -> WATER: Fluid horizontal ripples & liquid wave dispersion
            const waterWave = Math.sin(time * 0.8 + p.r * 0.22);
            dirX = waterWave * 22 + (bB - bA) * 14;
            dirY = Math.sin(p.c * 0.16) * 16 + 5;
          } else if (baseIdx === 3) {
            // WATER -> LANDSCAPE: Mountain ridge formation & horizon settling
            const ridgeWave = Math.cos(p.r * 0.12 + p.c * 0.08);
            dirX = ridgeWave * 16 + (bB - bA) * 12;
            dirY = -Math.sin(p.c * 0.10) * 18 - (bB - bA) * 16;
          } else if (baseIdx === 4) {
            // LANDSCAPE -> SPACE: Mountain peaks dissolve outwards into the cosmic starfield
            const dissipate = Math.sin(p.c * 0.08 - p.r * 0.06);
            const angle = Math.atan2(p.r - rows * 0.45, p.c - cols * 0.5);
            const normDist = 1 - (p.r / (rows || 1));
            dirX = Math.cos(angle) * (18 * normDist) + dissipate * 12 + (bB - bA) * 14;
            dirY = Math.sin(angle) * (16 * normDist) - 10 + (bB - bA) * 14;
          }

          morphX = dirX * travelFactor * displacementIntensity;
          morphY = dirY * travelFactor * displacementIntensity;
        }

        let px = p.baseX + finalWaveX + morphX;
        let py = p.baseY + finalWaveY + morphY;

        // 4. Soft Pointer Magnetic/Repulsion Influence (subtle local response that fades smoothly)
        if (interactiveActive) {
          const dx = px - curMouseX;
          const dy = py - curMouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 5.5 * motionIntensity;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        tierBatches[tier].push(px, py);
      }

      // Draw the 6 tiers with exactly 6 font and fillStyle state switches
      for (let t = 0; t < 6; t++) {
        const batch = tierBatches[t];
        if (batch.length === 0) continue;

        const config = tiers[t];
        ctx.font = `${config.fontSize}px 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = config.fillStyle;

        // Optical vertical offset so character '.' is visually centered in grid cell
        const yOffset = config.fontSize * 0.18;

        for (let j = 0; j < batch.length; j += 2) {
          // Render exclusively the dot character '.'
          ctx.fillText('.', batch[j], batch[j + 1] - yOffset);
        }
      }
    };

    // 3. Animation Loop with RAF & Page Visibility Control
    const loop = (currentTime: number) => {
      drawFrame(currentTime * 0.001);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    const startAnimation = () => {
      if (isReduced) {
        drawFrame(0);
        return;
      }
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    // 4. Resize Handling with Device Pixel Ratio
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === 0 || height === 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      sampleAllGrids();
    };

    updateCanvasSize();

    // 5. Event Listeners
    const handleResize = () => {
      updateCanvasSize();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40) {
        targetMousePosRef.current = { x, y };
        mouseActiveRef.current = true;
      } else {
        mouseActiveRef.current = false;
      }
    };

    const handlePointerLeave = () => {
      mouseActiveRef.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    return () => {
      isDisposed = true;
      stopAnimation();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    dotSpacing,
    brightness,
    contrast,
    opacity,
    motionIntensity,
    displacementIntensity,
    ambientMotion,
    ambientIntensity,
    interactive,
    isReduced,
  ]);

  // When morphProgress changes in reduced-motion mode, trigger a static redraw
  useEffect(() => {
    if (isReduced && canvasRef.current) {
      // Static presentation for reduced-motion users
    }
  }, [morphProgress, isReduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none select-none block ${className}`}
      style={{
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
