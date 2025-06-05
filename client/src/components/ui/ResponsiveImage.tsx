/**
 * Responsive Image Component
 * Optimized for all major browsers with format detection and lazy loading
 */

import React, { useState, useRef, useEffect } from 'react';
import { useBrowserOptimization } from '../../hooks/useBrowserOptimization';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 85,
  placeholder = 'blur',
  onLoad,
  onError
}) => {
  const {
    optimizeImage,
    getResponsiveImageSrcSet,
    shouldEnableFeature,
    supportsWebP,
    supportsAvif,
    isMobile
  } = useBrowserOptimization();

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!shouldEnableFeature('lazy-loading') || priority || isInView) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [shouldEnableFeature, priority, isInView]);

  // Generate optimized image sources
  const getImageSources = () => {
    if (!isInView) {
      return { src: '', srcSet: '' };
    }

    const optimizedSrc = optimizeImage(src, { width, height, quality });
    const srcSet = getResponsiveImageSrcSet(src, [320, 640, 768, 1024, 1280, 1920]);

    return {
      src: optimizedSrc,
      srcSet
    };
  };

  const { src: optimizedSrc, srcSet } = getImageSources();

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate placeholder based on browser capabilities
  const getPlaceholder = () => {
    if (placeholder === 'empty') return null;

    const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <circle cx="50%" cy="50%" r="20" fill="#d0d0d0" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    `)}`;

    return placeholderSvg;
  };

  // Error fallback component
  const ErrorFallback = () => (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="text-gray-400"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <img
          src={getPlaceholder()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ filter: 'blur(8px)' }}
        />
      )}

      {/* Main image */}
      {isInView && (
        <picture>
          {/* AVIF source for supported browsers */}
          {supportsAvif && (
            <source
              srcSet={optimizeImage(src, { width, height, quality }).replace(/\.(jpg|jpeg|png|webp)/, '.avif')}
              type="image/avif"
              sizes={sizes}
            />
          )}

          {/* WebP source for supported browsers */}
          {supportsWebP && (
            <source
              srcSet={optimizeImage(src, { width, height, quality }).replace(/\.(jpg|jpeg|png)/, '.webp')}
              type="image/webp"
              sizes={sizes}
            />
          )}

          {/* Fallback image */}
          <img
            ref={imgRef}
            src={optimizedSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={isMobile ? 'async' : 'auto'}
            className={`
              transition-opacity duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${width && height ? 'object-cover' : 'object-contain'}
              w-full h-full
            `}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              aspectRatio: width && height ? `${width} / ${height}` : undefined
            }}
          />
        </picture>
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};