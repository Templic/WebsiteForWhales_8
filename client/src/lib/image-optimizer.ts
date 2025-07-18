/**
 * Image Optimization Utilities
 * 
 * Provides functions for optimizing image loading, resizing, and format conversion.
 * These utilities help improve page load performance and user experience.
 */

/**
 * Generate a responsive image srcSet
 * 
 * @param baseSrc Original image source URL
 * @param widths Array of widths for responsive images
 * @param formatSuffix Optional format suffix (e.g. '.webp')
 * @returns A srcSet string for the img element
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  formatSuffix?: string
): string {
  // Don't process data: URLs or URLs without extensions
  if (baseSrc.startsWith('data:') || !baseSrc.includes('.')) {
    return '';
  }
  
  try {
    const srcWithoutExtension = baseSrc.substring(0, baseSrc.lastIndexOf('.'));
    const extension = formatSuffix || baseSrc.substring(baseSrc.lastIndexOf('.'));
    
    return widths
      .map(width => {
        const responsiveSrc = `${srcWithoutExtension}-${width}w${extension}`;
        return `${responsiveSrc} ${width}w`;
      })
      .join(', ');
  } catch (error) {
    console.error('Error generating srcSet:', error);
    return '';
  }
}

/**
 * Generate common sizes attribute
 * 
 * @param defaultWidth Default display width (optional)
 * @returns A sizes string for the img element
 */
export function generateSizes(defaultWidth?: string): string {
  return defaultWidth
    ? `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${defaultWidth}`
    : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

/**
 * Generate a low-quality placeholder for blur-up loading
 * 
 * @param src Original image source
 * @param width Width of the placeholder (low-res version)
 * @returns URL for the low-quality placeholder
 */
export function generatePlaceholder(src: string, width: number = 20): string {
  if (src.startsWith('data:') || !src.includes('.')) {
    return '';
  }
  
  try {
    const srcWithoutExtension = src.substring(0, src.lastIndexOf('.'));
    const extension = src.substring(src.lastIndexOf('.'));
    
    return `${srcWithoutExtension}-placeholder-${width}w${extension}`;
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return '';
  }
}

/**
 * Check if WebP is supported in the current browser
 * 
 * @returns Promise resolving to a boolean indicating WebP support
 */
export async function checkWebPSupport(): Promise<boolean> {
  return new Promise(resolve => {
    const webPImage = new Image();
    webPImage.onload = () => resolve(true);
    webPImage.onerror = () => resolve(false);
    webPImage.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Convert image URL to WebP format if possible
 * 
 * @param src Original image source
 * @param webPSupported Whether WebP is supported
 * @returns Modified URL with WebP extension
 */
export function convertToWebP(src: string, webPSupported: boolean): string {
  if (!webPSupported || src.startsWith('data:') || !src.match(/\.(jpg|jpeg|png)(\?.*)?$/i)) {
    return src;
  }
  
  return src.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2');
}

/**
 * Get optimal image dimensions based on container and device
 * 
 * @param containerWidth Width of the container (in px)
 * @param containerHeight Height of the container (in px)
 * @param originalWidth Original image width
 * @param originalHeight Original image height
 * @param devicePixelRatio Device pixel ratio for HiDPI screens
 * @returns Optimal width and height for the image
 */
export function getOptimalDimensions(
  containerWidth: number,
  containerHeight: number,
  originalWidth: number,
  originalHeight: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): { width: number; height: number } {
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;
  
  // Adjust for pixel density (HiDPI screens)
  const densityAdjustedWidth = containerWidth * devicePixelRatio;
  const densityAdjustedHeight = containerHeight * devicePixelRatio;
  
  // Calculate dimensions that maintain aspect ratio
  let width: number;
  let height: number;
  
  if (containerWidth / containerHeight > aspectRatio) {
    // Container is wider than image
    height = Math.min(densityAdjustedHeight, originalHeight);
    width = height * aspectRatio;
  } else {
    // Container is taller than image
    width = Math.min(densityAdjustedWidth, originalWidth);
    height = width / aspectRatio;
  }
  
  // Ensure we don't upscale beyond original dimensions
  width = Math.min(width, originalWidth);
  height = Math.min(height, originalHeight);
  
  // Round to avoid sub-pixel rendering issues
  return {
    width: Math.round(width),
    height: Math.round(height)
  };
}

/**
 * Preload critical images to improve perceived load time
 * 
 * @param urls Array of image URLs to preload
 * @param priority Whether to use high priority loading
 */
export function preloadImages(urls: string[], priority: boolean = false): void {
  if (!urls || urls.length === 0) return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    if (priority) {
      link.setAttribute('importance', 'high');
    }
    document.head.appendChild(link);
  });
}

/**
 * Generates a CSS background-image style with appropriate image format
 * 
 * @param src Image URL
 * @param webPSupported Whether WebP is supported
 * @returns CSS style object with background-image property
 */
export function getBackgroundImageStyle(
  src: string,
  webPSupported: boolean = false
): React.CSSProperties {
  const optimizedSrc = webPSupported ? convertToWebP(src, true) : src;
  
  return {
    backgroundImage: `url(${optimizedSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}