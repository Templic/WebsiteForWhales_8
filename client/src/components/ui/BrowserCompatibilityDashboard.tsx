/**
 * Browser Compatibility Dashboard
 * Comprehensive testing and monitoring interface for cross-browser performance
 */

import React, { useState, useEffect } from 'react';
import { useBrowserOptimization } from '../../hooks/useBrowserOptimization';

export const BrowserCompatibilityDashboard: React.FC = () => {
  const {
    browserInfo,
    performanceCapabilities,
    config,
    isServiceWorkerReady,
    getPerformanceReport,
    shouldEnableFeature
  } = useBrowserOptimization();

  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update performance report periodically
    const updateReport = () => {
      const report = getPerformanceReport();
      setPerformanceReport(report);
    };

    updateReport();
    const interval = setInterval(updateReport, 5000);

    return () => clearInterval(interval);
  }, [getPerformanceReport]);

  if (!browserInfo) {
    return null;
  }

  const getBrowserIcon = (name: string) => {
    switch (name) {
      case 'chrome':
        return '🟢';
      case 'firefox':
        return '🟠';
      case 'safari':
        return '🔵';
      case 'edge':
        return '🟣';
      case 'opera':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getPerformanceColor = (value: number, thresholds: number[]) => {
    if (value <= thresholds[0]) return 'text-green-600';
    if (value <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const featureTests = [
    { name: 'WebP Support', value: browserInfo.supportsWebP },
    { name: 'AVIF Support', value: browserInfo.supportsAvif },
    { name: 'WebGL Support', value: browserInfo.supportsWebGL },
    { name: 'Service Worker', value: browserInfo.supportsServiceWorker },
    { name: 'Intersection Observer', value: browserInfo.supportsIntersectionObserver },
    { name: 'Passive Events', value: browserInfo.supportsPassiveEvents },
    { name: 'Lazy Loading', value: shouldEnableFeature('lazy-loading') },
    { name: 'Advanced Animations', value: shouldEnableFeature('advanced-animations') },
    { name: 'Video Autoplay', value: shouldEnableFeature('video-autoplay') },
    { name: 'Parallax Effects', value: shouldEnableFeature('parallax') }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isExpanded ? 'w-96' : 'w-auto'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 ml-auto block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        title="Browser Compatibility Dashboard"
      >
        {getBrowserIcon(browserInfo.name)} {browserInfo.name.toUpperCase()}
      </button>

      {/* Dashboard Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Browser Compatibility</h3>
            <div className="text-sm text-gray-600">
              {browserInfo.name} {browserInfo.version} • {browserInfo.isMobile ? 'Mobile' : 'Desktop'}
            </div>
          </div>

          {/* Browser Info */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Engine:</span> {browserInfo.engine}
              </div>
              <div>
                <span className="font-medium">Touch:</span> {browserInfo.isTouch ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">DPR:</span> {browserInfo.devicePixelRatio}
              </div>
              <div>
                <span className="font-medium">Memory:</span> {performanceCapabilities?.memoryLimit}
              </div>
            </div>

            {/* Performance Metrics */}
            {performanceReport && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Performance</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Load Time:</span>
                    <span className={getPerformanceColor(performanceReport.averageLoadTime, [2000, 4000])}>
                      {performanceReport.averageLoadTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>FCP:</span>
                    <span className={getPerformanceColor(performanceReport.averageFCP, [1500, 3000])}>
                      {performanceReport.averageFCP.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>LCP:</span>
                    <span className={getPerformanceColor(performanceReport.averageLCP, [2500, 4000])}>
                      {performanceReport.averageLCP.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLS:</span>
                    <span className={getPerformanceColor(performanceReport.averageCLS * 1000, [100, 250])}>
                      {performanceReport.averageCLS.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Support */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Feature Support</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {featureTests.map((test) => (
                  <div key={test.name} className="flex items-center space-x-1">
                    <span className={test.value ? 'text-green-600' : 'text-red-600'}>
                      {test.value ? '✓' : '✗'}
                    </span>
                    <span className="truncate">{test.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            {config && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Configuration</h4>
                <div className="text-xs space-y-1">
                  <div>Image Format: {config.imageSettings.format.toUpperCase()}</div>
                  <div>Animation Level: {performanceCapabilities?.animationPerformance}</div>
                  <div>Max Requests: {config.maxConcurrentRequests}</div>
                  <div>Service Worker: {isServiceWorkerReady ? 'Ready' : 'Loading'}</div>
                </div>
              </div>
            )}

            {/* Optimization Recommendations */}
            {performanceReport?.browserOptimizations?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Recommendations</h4>
                <div className="text-xs space-y-1">
                  {performanceReport.browserOptimizations.slice(0, 3).map((opt: string, index: number) => (
                    <div key={index} className="text-blue-600">
                      • {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};