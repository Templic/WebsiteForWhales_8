/**
 * Progressive Image Loading Component
 * Implements WebP conversion and responsive image serving
 */

import React, { useState, useRef, useEffect, memo } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
}

export const ProgressiveImage = memo<ProgressiveImageProps>(({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  placeholder = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20400%20300'%3e%3crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3e%3c/svg%3e"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string) => {
    const baseUrl = baseSrc.replace(/\.[^.]+$/, '');
    const extension = baseSrc.split('.').pop();
    
    return [
      `${baseUrl}_320.webp 320w`,
      `${baseUrl}_640.webp 640w`,
      `${baseUrl}_1024.webp 1024w`,
      `${baseUrl}_1920.webp 1920w`,
      // Fallback to original format
      `${baseUrl}_320.${extension} 320w`,
      `${baseUrl}_640.${extension} 640w`,
      `${baseUrl}_1024.${extension} 1024w`,
      `${baseUrl}_1920.${extension} 1920w`
    ].join(', ');
  };

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Get optimized source URL
  const getOptimizedSrc = (originalSrc: string) => {
    if (supportsWebP()) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return originalSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setCurrentSrc(getOptimizedSrc(src));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSrc(getOptimizedSrc(src));
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src, priority]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    // Fallback to original format if WebP fails
    if (currentSrc.includes('.webp')) {
      setCurrentSrc(src);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'opacity-50' : ''}`}
      />
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Image unavailable</div>
        </div>
      )}
    </div>
  );
});

// Utility hook for image preloading
export const useImagePreloader = (imageSources: string[]) => {
  useEffect(() => {
    const preloadImages = imageSources.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      preloadImages.forEach(img => {
        img.src = '';
      });
    };
  }, [imageSources]);
};

// Background image component with optimization
export const OptimizedBackgroundImage = memo<{
  src: string;
  className?: string;
  children?: React.ReactNode;
}>(({ src, className = "", children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = optimizedSrc;
  }, [optimizedSrc]);

  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${optimizedSrc})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900 animate-pulse" />
      )}
      {children}
    </div>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';
OptimizedBackgroundImage.displayName = 'OptimizedBackgroundImage';