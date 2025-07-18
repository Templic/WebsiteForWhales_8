/**
 * LCPOptimizer Component
 * 
 * Optimizes the Largest Contentful Paint (LCP) metric by:
 * 1. Prioritizing critical resources
 * 2. Preloading key assets
 * 3. Applying instant loading techniques for LCP candidates
 * 4. Monitoring and reporting LCP performance
 * 
 * LCP is a key Core Web Vital that measures the time taken to render
 * the largest content element visible in the viewport.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// LCP element types that can be optimized
type LCPElementType = 
  | 'image' 
  | 'text' 
  | 'background-image' 
  | 'video' 
  | 'svg';

// Priority levels for elements
type PriorityLevel = 
  | 'critical' // Must be loaded immediately for first paint
  | 'high'     // Important but not on critical path
  | 'medium'   // Load after critical and high
  | 'low';     // Can be lazy-loaded

// Resource hints to use
type ResourceHint = 
  | 'preload'
  | 'prefetch'
  | 'preconnect'
  | 'dns-prefetch';

export interface LCPOptimizerProps {
  /** Children to render */
  children: React.ReactNode;
  /** Type of LCP element being optimized */
  elementType?: LCPElementType;
  /** Priority level of this content */
  priority?: PriorityLevel;
  /** Whether to enable instant loading techniques */
  instantLoading?: boolean;
  /** Whether to report LCP metrics */
  reportMetrics?: boolean;
  /** Preload resources needed for this element */
  preloadResources?: Array<{
    url: string;
    as: 'image' | 'style' | 'script' | 'font';
    type?: string;
    crossOrigin?: boolean;
  }>;
  /** Resource hints to add for optimal loading */
  resourceHints?: Array<{
    type: ResourceHint;
    url: string;
  }>;
  /** Fallback content to show while loading */
  fallback?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Style object */
  style?: React.CSSProperties;
  /** Whether to enable debugging */
  debug?: boolean;
  /** Font display strategy */
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /** Callback when LCP is recorded */
  onLCPRecorded?: (lcpTime: number) => void;
}

/**
 * LCPOptimizer Component
 * 
 * Wraps and optimizes elements that are likely to be the Largest Contentful Paint
 * element on the page, ensuring they load as quickly as possible.
 */
export const LCPOptimizer: React.FC<LCPOptimizerProps> = ({
  children,
  elementType = 'image',
  priority = 'critical',
  instantLoading = true,
  reportMetrics = true,
  preloadResources = [],
  resourceHints = [],
  fallback,
  className = '',
  style = {},
  debug = false,
  fontDisplay = 'swap',
  onLCPRecorded,
}) => {
  // Track if this component is the LCP element
  const [isLCP, setIsLCP] = useState(false);
  // Reference to the DOM element
  const elementRef = useRef<HTMLDivElement>(null);
  // Track if element has loaded
  const [isLoaded, setIsLoaded] = useState(false);
  // Track LCP measurement
  const [lcpTime, setLcpTime] = useState<number | null>(null);
  // IntersectionObserver to check visibility
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '0px',
    threshold: 0.1,
  });
  
  // Combine refs
  const setRefs = (node: HTMLDivElement | null) => {
    elementRef.current = node;
    inViewRef(node);
  };
  
  // Apply needed resource hints on mount
  useEffect(() => {
    // Only add resource hints for critical or high priority elements
    if (priority === 'critical' || priority === 'high') {
      // Add preload links to document head
      preloadResources.forEach(resource => {
        const linkEl = document.createElement('link');
        linkEl.rel = 'preload';
        linkEl.href = resource.url;
        linkEl.as = resource.as;
        
        if (resource.type) {
          linkEl.type = resource.type;
        }
        
        if (resource.crossOrigin) {
          linkEl.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(linkEl);
      });
      
      // Add other resource hints
      resourceHints.forEach(hint => {
        const linkEl = document.createElement('link');
        linkEl.rel = hint.type;
        linkEl.href = hint.url;
        document.head.appendChild(linkEl);
      });
      
      // Clean up on unmount
      return () => {
        document.querySelectorAll(`link[rel="preload"][href^="${preloadResources.map(r => r.url).join(',')}"]`)
          .forEach(el => el.remove());
          
        document.querySelectorAll(`link[rel^="${resourceHints.map(h => h.type).join(',')}"]`)
          .forEach(el => el.remove());
      };
    }
  }, []);
  
  // Observe LCP events using PerformanceObserver
  useEffect(() => {
    if (!reportMetrics) return;
    
    // Only use PerformanceObserver if it's available
    if (typeof PerformanceObserver === 'undefined') {
      if (debug) {
        console.log('[LCPOptimizer] PerformanceObserver not available');
      }
      return;
    }
    
    let lcpObserver: PerformanceObserver;
    
    try {
      // Create observer for LCP
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        if (entries.length > 0) {
          const lcpEntry = entries[entries.length - 1];
          const time = lcpEntry.startTime;
          setLcpTime(time);
          
          if (debug) {
            console.log('[LCPOptimizer] LCP recorded:', time);
          }
          
          // Check if this element is the LCP element
          if (elementRef.current && lcpEntry.element === elementRef.current) {
            setIsLCP(true);
            if (debug) {
              console.log('[LCPOptimizer] This element is the LCP element');
            }
          }
          
          // Call onLCPRecorded callback
          if (onLCPRecorded) {
            onLCPRecorded(time);
          }
        }
      });
      
      // Start observing paint entries
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Clean up observer on unmount
      return () => {
        lcpObserver.disconnect();
      };
    } catch (error) {
      if (debug) {
        console.error('[LCPOptimizer] Error setting up PerformanceObserver:', error);
      }
    }
  }, [debug, onLCPRecorded, reportMetrics]);
  
  // Mark element as loaded when it becomes visible
  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
    }
  }, [inView, isLoaded]);
  
  // Generate class names
  const classes = [
    className,
    'lcp-optimizer',
    `lcp-${elementType}`,
    `priority-${priority}`,
    isLCP ? 'is-lcp' : '',
    isLoaded ? 'loaded' : 'loading',
  ].filter(Boolean).join(' ');
  
  // Generate style object
  const combinedStyles: React.CSSProperties = {
    ...style,
    // For critical elements, ensure they render immediately
    ...(priority === 'critical' ? {
      content: 'visible',
      willChange: 'contents',
    } : {}),
    // For text, use font-display strategy
    ...(elementType === 'text' ? {
      fontDisplay: fontDisplay as any,
    } : {}),
  };
  
  // Ensure instant loading for critical elements
  const renderContent = () => {
    // Always render critical content
    if (priority === 'critical' || isLoaded) {
      return children;
    }
    
    // For non-critical content, show fallback until visible
    return fallback || <div className="lcp-fallback" />;
  };
  
  return (
    <div 
      ref={setRefs}
      className={classes}
      style={combinedStyles}
      data-lcp-element={elementType}
      data-lcp-priority={priority}
      data-lcp-time={lcpTime || 'not-recorded'}
    >
      {renderContent()}
      
      {/* For debugging */}
      {debug && isLCP && (
        <div className="lcp-debug">
          <p>LCP: {lcpTime?.toFixed(2)}ms</p>
        </div>
      )}
    </div>
  );
};

export default LCPOptimizer;