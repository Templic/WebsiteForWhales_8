/**
 * Mobile Touch Optimization for Three.js Components
 * Optimizes touch event handling for mobile devices
 */

import React, { useEffect, useRef, useCallback, memo } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface MobileTouchOptimizerProps {
  onSingleTouch?: (point: TouchPoint) => void;
  onPinch?: (scale: number, center: TouchPoint) => void;
  onRotate?: (rotation: number, center: TouchPoint) => void;
  onPan?: (delta: { x: number; y: number }) => void;
  enablePassiveListeners?: boolean;
  preventBounce?: boolean;
}

export const useMobileTouchOptimizer = ({
  onSingleTouch,
  onPinch,
  onRotate,
  onPan,
  enablePassiveListeners = true,
  preventBounce = true
}: MobileTouchOptimizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchState = useRef({
    touches: new Map<number, TouchPoint>(),
    lastPinchDistance: 0,
    lastRotation: 0,
    isPinching: false,
    isRotating: false,
    isPanning: false
  });

  const getTouchPoint = useCallback((touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    id: touch.identifier
  }), []);

  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getAngle = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  }, []);

  const getCenter = useCallback((point1: TouchPoint, point2: TouchPoint): TouchPoint => ({
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
    id: -1
  }), []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventBounce) {
      event.preventDefault();
    }

    const touches = Array.from(event.touches).map(getTouchPoint);
    
    // Clear previous touches
    touchState.current.touches.clear();
    
    // Store current touches
    touches.forEach(touch => {
      touchState.current.touches.set(touch.id, touch);
    });

    // Initialize gesture states
    if (touches.length === 2) {
      const [touch1, touch2] = touches;
      touchState.current.lastPinchDistance = getDistance(touch1, touch2);
      touchState.current.lastRotation = getAngle(touch1, touch2);
      touchState.current.isPinching = true;
      touchState.current.isRotating = true;
    } else if (touches.length === 1) {
      touchState.current.isPanning = true;
      onSingleTouch?.(touches[0]);
    }
  }, [getTouchPoint, getDistance, getAngle, onSingleTouch, preventBounce]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (preventBounce) {
      event.preventDefault();
    }

    const touches = Array.from(event.touches).map(getTouchPoint);
    
    if (touches.length === 2 && (touchState.current.isPinching || touchState.current.isRotating)) {
      const [touch1, touch2] = touches;
      const center = getCenter(touch1, touch2);
      
      // Handle pinch gesture
      if (touchState.current.isPinching && onPinch) {
        const currentDistance = getDistance(touch1, touch2);
        const scale = currentDistance / touchState.current.lastPinchDistance;
        onPinch(scale, center);
        touchState.current.lastPinchDistance = currentDistance;
      }
      
      // Handle rotation gesture
      if (touchState.current.isRotating && onRotate) {
        const currentRotation = getAngle(touch1, touch2);
        const rotationDelta = currentRotation - touchState.current.lastRotation;
        onRotate(rotationDelta, center);
        touchState.current.lastRotation = currentRotation;
      }
    } else if (touches.length === 1 && touchState.current.isPanning && onPan) {
      const currentTouch = touches[0];
      const previousTouch = touchState.current.touches.get(currentTouch.id);
      
      if (previousTouch) {
        const delta = {
          x: currentTouch.x - previousTouch.x,
          y: currentTouch.y - previousTouch.y
        };
        onPan(delta);
      }
    }

    // Update stored touches
    touches.forEach(touch => {
      touchState.current.touches.set(touch.id, touch);
    });
  }, [getTouchPoint, getDistance, getAngle, getCenter, onPinch, onRotate, onPan, preventBounce]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (preventBounce) {
      event.preventDefault();
    }

    // Reset gesture states
    if (event.touches.length < 2) {
      touchState.current.isPinching = false;
      touchState.current.isRotating = false;
    }
    
    if (event.touches.length === 0) {
      touchState.current.isPanning = false;
      touchState.current.touches.clear();
    }
  }, [preventBounce]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const options = enablePassiveListeners ? { passive: false } : false;

    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);
    element.addEventListener('touchcancel', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enablePassiveListeners]);

  return containerRef;
};

// Component wrapper for Three.js scenes with mobile optimization
export const MobileOptimizedThreeJS = memo<{
  children: React.ReactNode;
  onCameraControl?: (type: 'pan' | 'zoom' | 'rotate', data: any) => void;
  className?: string;
}>(({ children, onCameraControl, className = "" }) => {
  const touchRef = useMobileTouchOptimizer({
    onSingleTouch: (point) => {
      onCameraControl?.('pan', { x: point.x, y: point.y });
    },
    onPinch: (scale, center) => {
      onCameraControl?.('zoom', { scale, center });
    },
    onRotate: (rotation, center) => {
      onCameraControl?.('rotate', { rotation, center });
    },
    onPan: (delta) => {
      onCameraControl?.('pan', delta);
    },
    enablePassiveListeners: false,
    preventBounce: true
  });

  return (
    <div 
      ref={touchRef}
      className={`touch-none select-none ${className}`}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
});

// Performance monitoring for touch events
export const useTouchPerformanceMonitor = () => {
  const touchMetrics = useRef({
    touchStartTime: 0,
    touchCount: 0,
    averageResponseTime: 0
  });

  const recordTouchStart = useCallback(() => {
    touchMetrics.current.touchStartTime = performance.now();
  }, []);

  const recordTouchEnd = useCallback(() => {
    const responseTime = performance.now() - touchMetrics.current.touchStartTime;
    touchMetrics.current.touchCount++;
    
    // Calculate running average
    const count = touchMetrics.current.touchCount;
    touchMetrics.current.averageResponseTime = 
      (touchMetrics.current.averageResponseTime * (count - 1) + responseTime) / count;

    // Log slow touch responses
    if (responseTime > 16) { // Target 60fps
      console.warn(`Slow touch response: ${responseTime.toFixed(2)}ms`);
    }
  }, []);

  const getTouchMetrics = useCallback(() => ({
    averageResponseTime: touchMetrics.current.averageResponseTime,
    touchCount: touchMetrics.current.touchCount
  }), []);

  return { recordTouchStart, recordTouchEnd, getTouchMetrics };
};

MobileOptimizedThreeJS.displayName = 'MobileOptimizedThreeJS';