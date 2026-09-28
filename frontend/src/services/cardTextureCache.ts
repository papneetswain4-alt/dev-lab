/**
 * DEV.LAB — Card Texture Cache Service
 * 
 * Manages loading, caching, and pre-processing of the four monochrome abstract 
 * card background images:
 * - texture-01: /images/card-ascii/cardbackground1.jpeg (Liquid Wave)
 * - texture-02: /images/card-ascii/cardbackground2.jpeg (Molten Chrome)
 * - texture-03: /images/card-ascii/cardbackground3.jpeg (Ink Splash)
 * - texture-04: /images/card-ascii/cardbackground4.jpeg (Marbled Swirl)
 */

export type TextureId = 'texture-01' | 'texture-02' | 'texture-03' | 'texture-04';

export interface TextureDefinition {
  id: TextureId;
  src: string;
  name: string;
  description: string;
  defaultInvert?: boolean;
}

export const CARD_TEXTURES: Record<TextureId, TextureDefinition> = {
  'texture-01': {
    id: 'texture-01',
    src: '/images/card-ascii/cardbackground1.jpeg',
    name: 'Liquid Wave',
    description: 'Smooth organic liquid silk contours with flowing midtones',
    defaultInvert: false,
  },
  'texture-02': {
    id: 'texture-02',
    src: '/images/card-ascii/cardbackground2.jpeg',
    name: 'Molten Chrome',
    description: 'Specular metallic fluid and reflective folds',
    defaultInvert: false,
  },
  'texture-03': {
    id: 'texture-03',
    src: '/images/card-ascii/cardbackground3.jpeg',
    name: 'Ink Splash',
    description: 'Dynamic directional brush stroke with trajectory and splatter',
    // Invert so dark ink strokes become bright luminous ASCII dots on dark card background
    defaultInvert: true,
  },
  'texture-04': {
    id: 'texture-04',
    src: '/images/card-ascii/cardbackground4.jpeg',
    name: 'Marbled Swirl',
    description: 'High-energy organic paint droplets, tendrils, and turbulence',
    defaultInvert: false,
  },
};

// In-memory cache of loaded image elements
const imageCache = new Map<TextureId, HTMLImageElement>();
const loadingPromises = new Map<TextureId, Promise<HTMLImageElement>>();

/**
 * Load and cache a texture image
 */
export function loadTextureImage(id: TextureId): Promise<HTMLImageElement> {
  const cached = imageCache.get(id);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const existingPromise = loadingPromises.get(id);
  if (existingPromise) {
    return existingPromise;
  }

  const texture = CARD_TEXTURES[id];
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = texture.src;
    img.onload = () => {
      imageCache.set(id, img);
      loadingPromises.delete(id);
      resolve(img);
    };
    img.onerror = (err) => {
      loadingPromises.delete(id);
      console.warn(`[CardTextureCache] Failed to load image for ${id}:`, err);
      reject(err);
    };
  });

  loadingPromises.set(id, promise);
  return promise;
}

/**
 * Preload all 4 texture images
 */
export function preloadAllCardTextures(): void {
  const ids: TextureId[] = ['texture-01', 'texture-02', 'texture-03', 'texture-04'];
  ids.forEach((id) => {
    loadTextureImage(id).catch(() => {
      // Non-fatal, handled gracefully
    });
  });
}

// Auto-trigger preload in browser environment
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
      preloadAllCardTextures();
    });
  } else {
    setTimeout(preloadAllCardTextures, 100);
  }
}
