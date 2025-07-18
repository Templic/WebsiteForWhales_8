/**
 * Performance Test Page for Binaural Beat Generator
 * 
 * This page benchmarks and compares the performance between the original
 * Binaural Beat Generator and the optimized version.
 */

import React, { useState, useEffect } from 'react';
import OriginalBinauralBeatGenerator from '../../components/features/audio/binaural-beat-generator';
import OptimizedBinauralBeatGenerator from '../../components/features/audio/binaural-beat-generator.optimized';
import { compareComponentPerformance, PerformanceResult } from '../../utils/performance-test-utils';
import { PerformanceProfiler } from '../../lib/performance';

const BinauralBeatPerformanceTest: React.FC = () => {
  // Test results
  const [originalResults, setOriginalResults] = useState<PerformanceResult | null>(null);
  const [optimizedResults, setOptimizedResults] = useState<PerformanceResult | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Run performance test
  const runPerformanceTest = async () => {
    setIsRunningTest(true);
    setErrorMessage(null);
    
    try {
      // Run the comparative test
      const [original, optimized] = await compareComponentPerformance(
        OriginalBinauralBeatGenerator,
        OptimizedBinauralBeatGenerator
      );
      
      setOriginalResults(original);
      setOptimizedResults(optimized);
    } catch (error) {
      console.error('Performance test failed:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unknown error during performance test'
      );
    } finally {
      setIsRunningTest(false);
    }
  };
  
  // Format a performance result as a percentage improvement
  const calculateImprovement = (original: number, optimized: number): string => {
    if (original === 0 || optimized === 0) return 'N/A';
    
    const improvement = ((original - optimized) / original) * 100;
    return improvement > 0
      ? `${improvement.toFixed(1)}% faster`
      : `${Math.abs(improvement).toFixed(1)}% slower`;
  };
  
  return (
    <div className="performance-test-page">
      <h1 className="text-2xl font-bold mb-6">Binaural Beat Generator Performance Test</h1>
      
      <div className="test-controls mb-6">
        <button
          onClick={runPerformanceTest}
          disabled={isRunningTest}
          className={`px-4 py-2 rounded ${
            isRunningTest
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isRunningTest ? 'Running Test...' : 'Run Performance Test'}
        </button>
      </div>
      
      {errorMessage && (
        <div className="error-message text-red-500 mb-6 p-3 bg-red-100 rounded">
          <h3 className="font-semibold">Test Error:</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      
      {originalResults && optimizedResults && (
        <div className="test-results mb-10">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Metric</th>
                <th className="border p-2 text-left">Original</th>
                <th className="border p-2 text-left">Optimized</th>
                <th className="border p-2 text-left">Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Initial Render Time</td>
                <td className="border p-2">{originalResults.initialRender.toFixed(2)} ms</td>
                <td className="border p-2">{optimizedResults.initialRender.toFixed(2)} ms</td>
                <td className="border p-2">
                  {calculateImprovement(
                    originalResults.initialRender,
                    optimizedResults.initialRender
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Rerender Time</td>
                <td className="border p-2">{originalResults.rerender.toFixed(2)} ms</td>
                <td className="border p-2">{optimizedResults.rerender.toFixed(2)} ms</td>
                <td className="border p-2">
                  {calculateImprovement(
                    originalResults.rerender,
                    optimizedResults.rerender
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2">State Change Propagation</td>
                <td className="border p-2">{originalResults.stateChange.toFixed(2)} ms</td>
                <td className="border p-2">{optimizedResults.stateChange.toFixed(2)} ms</td>
                <td className="border p-2">
                  {calculateImprovement(
                    originalResults.stateChange,
                    optimizedResults.stateChange
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Prop Change Propagation</td>
                <td className="border p-2">{originalResults.propChange.toFixed(2)} ms</td>
                <td className="border p-2">{optimizedResults.propChange.toFixed(2)} ms</td>
                <td className="border p-2">
                  {calculateImprovement(
                    originalResults.propChange,
                    optimizedResults.propChange
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      <div className="component-comparison grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="original-component border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Original Component</h2>
          <PerformanceProfiler id="original-binaural-beat">
            <OriginalBinauralBeatGenerator />
          </PerformanceProfiler>
        </div>
        
        <div className="optimized-component border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Optimized Component</h2>
          <PerformanceProfiler id="optimized-binaural-beat">
            <OptimizedBinauralBeatGenerator />
          </PerformanceProfiler>
        </div>
      </div>
      
      <div className="performance-notes mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Performance Optimization Notes</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Memoization:</strong> The optimized version uses React.memo and
            useCallback to prevent unnecessary re-renders.
          </li>
          <li>
            <strong>Component Splitting:</strong> UI elements are broken into smaller,
            focused components to minimize render scope.
          </li>
          <li>
            <strong>Stable References:</strong> Event handlers and complex objects are
            stabilized to prevent re-creation on each render.
          </li>
          <li>
            <strong>Error Handling:</strong> Improved error boundaries and null checks
            for better stability.
          </li>
          <li>
            <strong>Render Optimization:</strong> Reduced unnecessary state updates and
            layout thrashing.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BinauralBeatPerformanceTest;