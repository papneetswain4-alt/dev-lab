import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  TextureId,
  CARD_TEXTURES,
  loadTextureImage,
} from '../../services/cardTextureCache';

export interface AsciiImageTextureProps {
  /** Identifier of one of the 4 supplied textures */
  texture: TextureId;
  /** Dot spacing in pixels (grid cell size). Defaults to 5.8px for ultra-high visual resolution */
  dotSpacing?: number;
  /** Sampling density multiplier (default 1.0; >1.0 creates a tighter, finer dot grid) */
  density?: number;
  /** Detail enhancement factor for edge & contour preservation (default 1.0) */
  detail?: number;
  /** Scale factor for the dot marks (default 1.0) */
  dotScale?: number;
  /** Base opacity of the texture layer (0 to 1, default 0.35) */
  opacity?: number;
  /** Target opacity when the card is hovered (default 0.58) */
  hoverOpacity?: number;
  /** Luminance contrast multiplier (default 1.35) */
  contrast?: number;
  /** Brightness multiplier (default 1.08) */
  brightness?: number;
  /** Invert luminance (if true, dark areas produce dots, light areas are empty) */
  invert?: boolean;
  /** Framing / crop focal point */
  crop?: 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'cover';
  /** Fade gradient mask to protect text while maintaining rich card presence */
  fade?: 'radial' | 'to-b' | 'to-t' | 'to-l' | 'to-r' | 'corner-tr' | 'corner-br' | 'corner-tl' | 'none';
  /** Whether to apply subtle scale / opacity response on parent .group hover */
  hoverEffect?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const AsciiImageTexture: React.FC<AsciiImageTextureProps> = ({
  texture,
  dotSpacing = 5.8,
  density = 1.0,
  detail = 1.0,
  dotScale = 1.0,
  opacity = 0.34,
  hoverOpacity = 0.58,
  contrast = 1.35,
  brightness = 1.08,
  invert,
  crop = 'center',
  fade = 'none',
  hoverEffect = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const textureDef = CARD_TEXTURES[texture];
  const shouldInvert = invert !== undefined ? invert : !!textureDef?.defaultInvert;

  // Compute CSS mask based on fade direction.
  // Preserves full card coverage: high intensity in open zones, subtle presence across text zones
  const maskStyle = useMemo(() => {
    switch (fade) {
      case 'corner-tr':
        return {
          maskImage: 'radial-gradient(ellipse 110% 110% at 90% 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 110% 110% at 90% 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
        };
      case 'corner-br':
        return {
          maskImage: 'radial-gradient(ellipse 110% 110% at 90% 90%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 110% 110% at 90% 90%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
        };
      case 'corner-tl':
        return {
          maskImage: 'radial-gradient(ellipse 110% 110% at 10% 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 110% 110% at 10% 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.30) 100%)',
        };
      case 'radial':
        return {
          maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.32) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.32) 100%)',
        };
      case 'to-b':
        return {
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
        };
      case 'to-t':
        return {
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
        };
      case 'to-l':
        return {
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
        };
      case 'to-r':
        return {
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.70) 55%, rgba(0,0,0,0.28) 100%)',
        };
      default:
        return {};
    }
  }, [fade]);

  useEffect(() => {
    let isDisposed = false;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let imgElement: HTMLImageElement | null = null;

    const renderTexture = () => {
      if (isDisposed || !imgElement || !canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Ultra-high detail grid spacing: responsive, tighter on mobile
      const effectiveSpacing = Math.max(4.8, (dotSpacing / density));
      const cols = Math.floor(width / effectiveSpacing);
      const rows = Math.floor(height / effectiveSpacing);

      if (cols <= 0 || rows <= 0) return;

      // 2X Super-Sampling Canvas: captures fine edges, micro-droplets & narrow contours
      const sampleW = cols * 2;
      const sampleH = rows * 2;
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = sampleW;
      sampleCanvas.height = sampleH;
      const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!sCtx) return;

      // Calculate crop source rectangle based on crop focal point
      const imgW = imgElement.naturalWidth || imgElement.width;
      const imgH = imgElement.naturalHeight || imgElement.height;
      const targetAspect = width / height;
      const imgAspect = imgW / imgH;

      let sx = 0;
      let sy = 0;
      let sWidth = imgW;
      let sHeight = imgH;

      if (targetAspect > imgAspect) {
        // Card is wider than image: crop top/bottom
        sHeight = Math.round(imgW / targetAspect);
        if (crop === 'top-right' || crop === 'top-left') {
          sy = 0;
        } else if (crop === 'bottom-right' || crop === 'bottom-left') {
          sy = imgH - sHeight;
        } else {
          sy = Math.round((imgH - sHeight) / 2);
        }
      } else {
        // Card is taller than image: crop left/right
        sWidth = Math.round(imgH * targetAspect);
        if (crop === 'top-left' || crop === 'bottom-left') {
          sx = 0;
        } else if (crop === 'top-right' || crop === 'bottom-right') {
          sx = imgW - sWidth;
        } else {
          sx = Math.round((imgW - sWidth) / 2);
        }
      }

      sCtx.drawImage(imgElement, sx, sy, sWidth, sHeight, 0, 0, sampleW, sampleH);

      let imgData: ImageData;
      try {
        imgData = sCtx.getImageData(0, 0, sampleW, sampleH);
      } catch (err) {
        console.warn('[AsciiImageTexture] Failed reading image data:', err);
        return;
      }

      const data = imgData.data;

      // 8 Optical Tiers: complete monochrome tonal continuum from deep charcoal to specular white
      const scale = dotScale * (effectiveSpacing / 5.8);
      const tiers: { fontSize: number; fillStyle: string; yOffset: number }[] = [
        { fontSize: Math.max(2.8, 3.2 * scale), fillStyle: 'rgba(100, 100, 100, 0.32)', yOffset: 0.65 },
        { fontSize: Math.max(3.3, 3.8 * scale), fillStyle: 'rgba(132, 132, 132, 0.46)', yOffset: 0.80 },
        { fontSize: Math.max(3.8, 4.4 * scale), fillStyle: 'rgba(162, 162, 162, 0.60)', yOffset: 0.95 },
        { fontSize: Math.max(4.3, 5.0 * scale), fillStyle: 'rgba(188, 188, 188, 0.74)', yOffset: 1.10 },
        { fontSize: Math.max(4.8, 5.6 * scale), fillStyle: 'rgba(212, 212, 212, 0.85)', yOffset: 1.25 },
        { fontSize: Math.max(5.3, 6.2 * scale), fillStyle: 'rgba(232, 232, 232, 0.92)', yOffset: 1.40 },
        { fontSize: Math.max(5.8, 6.8 * scale), fillStyle: 'rgba(245, 245, 245, 0.98)', yOffset: 1.55 },
        { fontSize: Math.max(6.4, 7.5 * scale), fillStyle: 'rgba(255, 255, 255, 1.00)', yOffset: 1.70 },
      ];

      // Flat number arrays for tier point batches: [x, y, x, y, ...]
      const batches: number[][] = [[], [], [], [], [], [], [], []];

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Read 2x2 sub-pixels from the super-sampled buffer
          const r2 = r * 2;
          const c2 = c * 2;

          const idx00 = (r2 * sampleW + c2) * 4;
          const idx01 = (r2 * sampleW + (c2 + 1)) * 4;
          const idx10 = ((r2 + 1) * sampleW + c2) * 4;
          const idx11 = ((r2 + 1) * sampleW + (c2 + 1)) * 4;

          // ITU-R BT.709 relative luminance for each sub-pixel
          let l00 = (0.2126 * data[idx00] + 0.7152 * data[idx00 + 1] + 0.0722 * data[idx00 + 2]) / 255;
          let l01 = (0.2126 * data[idx01] + 0.7152 * data[idx01 + 1] + 0.0722 * data[idx01 + 2]) / 255;
          let l10 = (0.2126 * data[idx10] + 0.7152 * data[idx10 + 1] + 0.0722 * data[idx10 + 2]) / 255;
          let l11 = (0.2126 * data[idx11] + 0.7152 * data[idx11 + 1] + 0.0722 * data[idx11 + 2]) / 255;

          if (shouldInvert) {
            l00 = 1.0 - l00;
            l01 = 1.0 - l01;
            l10 = 1.0 - l10;
            l11 = 1.0 - l11;
          }

          // Average luminance
          let avgL = (l00 + l01 + l10 + l11) * 0.25;

          // Local gradient & edge-aware contrast enhancement
          const diffH = (l01 + l11) - (l00 + l10);
          const diffV = (l10 + l11) - (l00 + l01);
          const edgeStrength = Math.hypot(diffH, diffV) * 0.5;

          // Sharpen narrow contours and fine fluid ripples
          if (detail > 0 && edgeStrength > 0.05) {
            const edgeBoost = (avgL > 0.5 ? 1 : -1) * edgeStrength * 0.42 * detail;
            avgL = Math.max(0, Math.min(1, avgL + edgeBoost));
          }

          // Apply contrast curve and brightness
          let b = Math.pow(avgL, 1.10);
          b = (b - 0.5) * contrast + 0.5;
          b = Math.max(0, Math.min(1, b)) * brightness;

          // Skip true-black negative space to allow card surface depth
          if (b < 0.038) continue;

          // 8-Tier quantization mapping
          let tierIndex = Math.min(7, Math.floor(b * 8));

          // Sub-pixel stippling shift: shifts dot up to 22% towards local contour peak
          const shiftFactor = 0.22 * detail;
          const offsetX = diffH * shiftFactor * cellW;
          const offsetY = diffV * shiftFactor * cellH;

          const px = c * cellW + cellW * 0.5 + offsetX;
          const py = r * cellH + cellH * 0.5 + offsetY;

          batches[tierIndex].push(px, py);
        }
      }

      // Draw all 8 tier batches with exactly 8 font and fillStyle state switches
      for (let t = 0; t < 8; t++) {
        const batch = batches[t];
        if (batch.length === 0) continue;

        const config = tiers[t];
        ctx.font = `${config.fontSize}px 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = config.fillStyle;

        for (let j = 0; j < batch.length; j += 2) {
          // Exclusively render the period dot character '.'
          ctx.fillText('.', batch[j], batch[j + 1] - config.yOffset);
        }
      }

      setIsLoaded(true);
    };

    // Load the image from cache or fetch
    loadTextureImage(texture)
      .then((img) => {
        if (isDisposed) return;
        imgElement = img;
        renderTexture();
      })
      .catch(() => {
        // Silently handle if image loading failed
      });

    // ResizeObserver to re-render pattern when card dimensions change
    let resizeTimer: number | null = null;
    const observer = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(renderTexture, 50);
    });

    observer.observe(container);

    return () => {
      isDisposed = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, [texture, dotSpacing, density, detail, dotScale, contrast, brightness, shouldInvert, crop]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[inherit] z-0 ${className}`}
      style={maskStyle}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transform-gpu card-ascii-canvas ${
          hoverEffect ? 'hover-active' : ''
        } ${isLoaded ? '' : 'opacity-0'}`}
        style={
          {
            '--base-opacity': opacity,
            '--hover-opacity': hoverOpacity,
          } as React.CSSProperties
        }
      />
    </div>
  );
};
