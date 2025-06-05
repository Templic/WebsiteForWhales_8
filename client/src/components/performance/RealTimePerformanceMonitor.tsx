/**
 * Real-Time Performance Monitoring Dashboard
 * Implements automated regression testing and performance tracking
 */

import React, { useState, useEffect, useCallback, memo } from 'react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  bundleSize: number;
  memoryUsage: number;
  renderTime: number;
  apiLatency: number;
  cacheHitRate: number;
  timestamp: number;
}

interface PerformanceThresholds {
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  fcp: { good: number; poor: number };
  ttfb: { good: number; poor: number };
}

interface RegressionAlert {
  id: string;
  metric: string;
  previousValue: number;
  currentValue: number;
  degradationPercent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

export const RealTimePerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<RegressionAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const thresholds: PerformanceThresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 }
  };

  // Collect Core Web Vitals
  const collectWebVitals = useCallback((): Promise<Partial<PerformanceMetrics>> => {
    return new Promise((resolve) => {
      const vitals: Partial<PerformanceMetrics> = {
        timestamp: Date.now()
      };

      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.lcp = lastEntry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          vitals.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ type: 'first-input', buffered: true });

      // CLS (Cumulative Layout Shift)
      new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        vitals.cls = clsValue;
      }).observe({ type: 'layout-shift', buffered: true });

      // FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
        });
      }).observe({ type: 'paint', buffered: true });

      // Navigation timing for TTFB
      const navEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navEntry) {
        vitals.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      setTimeout(() => resolve(vitals), 100);
    });
  }, []);

  // Collect memory and bundle metrics
  const collectSystemMetrics = useCallback((): Partial<PerformanceMetrics> => {
    const systemMetrics: Partial<PerformanceMetrics> = {};

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      systemMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    // Bundle size estimation
    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    resources.forEach((resource: any) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
      }
    });
    systemMetrics.bundleSize = totalSize / 1024 / 1024; // MB

    // Average API latency
    const apiResources = resources.filter((r: any) => 
      r.name.includes('/api/')
    );
    if (apiResources.length > 0) {
      const avgLatency = apiResources.reduce((sum: number, r: any) => 
        sum + (r.responseEnd - r.requestStart), 0
      ) / apiResources.length;
      systemMetrics.apiLatency = avgLatency;
    }

    return systemMetrics;
  }, []);

  // Check for performance regressions
  const checkForRegressions = useCallback((newMetrics: PerformanceMetrics) => {
    if (metrics.length < 2) return;

    const previousMetrics = metrics[metrics.length - 1];
    const newAlerts: RegressionAlert[] = [];

    const checkMetric = (key: keyof PerformanceMetrics, threshold = 10) => {
      const prev = previousMetrics[key] as number;
      const curr = newMetrics[key] as number;
      
      if (prev && curr && curr > prev) {
        const degradation = ((curr - prev) / prev) * 100;
        
        if (degradation > threshold) {
          const severity = degradation > 50 ? 'critical' :
                          degradation > 30 ? 'high' :
                          degradation > 15 ? 'medium' : 'low';

          newAlerts.push({
            id: `${key}-${Date.now()}`,
            metric: key,
            previousValue: prev,
            currentValue: curr,
            degradationPercent: degradation,
            severity,
            timestamp: Date.now()
          });
        }
      }
    };

    checkMetric('lcp', 5);
    checkMetric('fid', 10);
    checkMetric('fcp', 5);
    checkMetric('ttfb', 10);
    checkMetric('memoryUsage', 15);
    checkMetric('apiLatency', 20);

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts].slice(-10)); // Keep last 10 alerts
    }
  }, [metrics]);

  // Main monitoring function
  const collectMetrics = useCallback(async () => {
    try {
      const webVitals = await collectWebVitals();
      const systemMetrics = collectSystemMetrics();
      
      const combinedMetrics: PerformanceMetrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0,
        bundleSize: 0,
        memoryUsage: 0,
        renderTime: 0,
        apiLatency: 0,
        cacheHitRate: 0,
        timestamp: Date.now(),
        ...webVitals,
        ...systemMetrics
      };

      setCurrentMetrics(combinedMetrics);
      setMetrics(prev => [...prev, combinedMetrics].slice(-100)); // Keep last 100 measurements
      checkForRegressions(combinedMetrics);
    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
    }
  }, [collectWebVitals, collectSystemMetrics, checkForRegressions]);

  // Start/stop monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      collectMetrics(); // Initial collection
      interval = setInterval(collectMetrics, 30000); // Every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, collectMetrics]);

  // Get performance grade
  const getPerformanceGrade = (metrics: PerformanceMetrics): string => {
    let score = 0;
    let total = 0;

    Object.entries(thresholds).forEach(([key, threshold]) => {
      const value = metrics[key as keyof PerformanceMetrics] as number;
      if (value) {
        total++;
        if (value <= threshold.good) score += 100;
        else if (value <= threshold.poor) score += 50;
        else score += 0;
      }
    });

    const avgScore = total > 0 ? score / total : 0;
    
    if (avgScore >= 90) return 'A';
    if (avgScore >= 80) return 'B';
    if (avgScore >= 70) return 'C';
    if (avgScore >= 60) return 'D';
    return 'F';
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Real-Time Performance Monitor
        </h2>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg font-medium ${
            isMonitoring 
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {currentMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Overall Grade</h3>
            <div className="text-3xl font-bold text-blue-600">
              {getPerformanceGrade(currentMetrics)}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">LCP</h3>
            <div className="text-xl font-bold text-green-600">
              {currentMetrics.lcp?.toFixed(0)}ms
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Memory</h3>
            <div className="text-xl font-bold text-purple-600">
              {currentMetrics.memoryUsage?.toFixed(1)}MB
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">Bundle Size</h3>
            <div className="text-xl font-bold text-orange-600">
              {currentMetrics.bundleSize?.toFixed(1)}MB
            </div>
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-3">
            Performance Regression Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      {alert.metric.toUpperCase()} regression detected
                    </div>
                    <div className="text-sm text-gray-600">
                      {alert.previousValue.toFixed(1)} → {alert.currentValue.toFixed(1)} 
                      ({alert.degradationPercent.toFixed(1)}% increase)
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        {isMonitoring ? 'Monitoring active' : 'Monitoring stopped'} • 
        {metrics.length} measurements collected • 
        Last updated: {currentMetrics ? new Date(currentMetrics.timestamp).toLocaleTimeString() : 'Never'}
      </div>
    </div>
  );
});

RealTimePerformanceMonitor.displayName = 'RealTimePerformanceMonitor';