/**
 * Adaptive Geometry Demo Page
 * Demonstrates throttled sacred geometry with device-specific optimization
 */

import React, { useState, useEffect } from 'react';
import AdaptiveSacredGeometry from '../components/cosmic/AdaptiveSacredGeometry';
import { multiAiGeometryOptimizer } from '../utils/multiAiGeometryOptimizer';

const AdaptiveGeometryDemo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState({
    overhead: 0,
    memoryUsage: 0,
    frameRate: 0
  });

  useEffect(() => {
    const initializeDemo = async () => {
      const capabilities = await multiAiGeometryOptimizer.detectDeviceCapabilities();
      setDeviceInfo(capabilities);
    };

    initializeDemo();

    // Monitor system performance
    const interval = setInterval(() => {
      const overhead = multiAiGeometryOptimizer.measureSystemOverhead();
      const memory = (performance as any).memory?.usedJSHeapSize || 0;
      
      setSystemMetrics({
        overhead,
        memoryUsage: memory / (1024 * 1024),
        frameRate: 60 // Estimated based on optimization
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const geometryVariants = [
    { variant: 'triangle', name: 'Triangle (Mobile)', complexity: 'Simple' },
    { variant: 'square', name: 'Square (Mobile)', complexity: 'Simple' },
    { variant: 'pentagon', name: 'Pentagon (Tablet)', complexity: 'Medium' },
    { variant: 'hexagon', name: 'Hexagon (Standard)', complexity: 'Medium' },
    { variant: 'octagon', name: 'Octagon (Desktop)', complexity: 'Complex' },
    { variant: 'dodecahedron', name: 'Dodecahedron (Desktop)', complexity: 'Complex' },
  ] as const;

  return (
    <div className="adaptive-geometry-demo">
      <div className="demo-header">
        <h1>Adaptive Sacred Geometry Optimization</h1>
        <p>AI-powered throttling for smooth performance across devices</p>
      </div>

      {deviceInfo && (
        <div className="device-info">
          <h2>Device Profile</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Device Type</h3>
              <p>{deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}</p>
            </div>
            <div className="info-card">
              <h3>CPU Cores</h3>
              <p>{deviceInfo.cpuCores}</p>
            </div>
            <div className="info-card">
              <h3>Memory Usage</h3>
              <p>{systemMetrics.memoryUsage.toFixed(1)} MB</p>
            </div>
            <div className="info-card">
              <h3>System Overhead</h3>
              <p>{systemMetrics.overhead.toFixed(1)} ms</p>
            </div>
            <div className="info-card">
              <h3>Connection</h3>
              <p>{deviceInfo.connectionType}</p>
            </div>
            {deviceInfo.batteryLevel && (
              <div className="info-card">
                <h3>Battery</h3>
                <p>{Math.round(deviceInfo.batteryLevel * 100)}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="optimization-explanation">
        <h2>Adaptive Scaling Strategy</h2>
        <div className="strategy-grid">
          <div className="strategy-card">
            <h3>Mobile Devices</h3>
            <ul>
              <li>Simple lower-order geometries (3-4 sides)</li>
              <li>Slow rotation speed (0.1x)</li>
              <li>Minimal particle effects</li>
              <li>Low CPU usage priority</li>
            </ul>
          </div>
          <div className="strategy-card">
            <h3>Tablet Devices</h3>
            <ul>
              <li>Medium complexity geometries (5-6 sides)</li>
              <li>Moderate rotation speed (0.3x)</li>
              <li>Basic effects enabled</li>
              <li>Balanced performance</li>
            </ul>
          </div>
          <div className="strategy-card">
            <h3>Desktop Devices</h3>
            <ul>
              <li>Complex higher-order geometries (8+ sides)</li>
              <li>Normal rotation speed (0.5x)</li>
              <li>Full effects and fractals</li>
              <li>GPU acceleration enabled</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="geometry-showcase">
        <h2>Geometry Complexity Showcase</h2>
        <div className="geometry-grid">
          {geometryVariants.map((geometry, index) => (
            <div key={geometry.variant} className="geometry-demo-item">
              <div className="geometry-container">
                <AdaptiveSacredGeometry
                  variant={geometry.variant}
                  size={80}
                  position="center"
                  intensity="medium"
                  enableOptimization={true}
                />
              </div>
              <div className="geometry-info">
                <h4>{geometry.name}</h4>
                <p className={`complexity ${geometry.complexity.toLowerCase()}`}>
                  {geometry.complexity} Complexity
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="live-demo">
        <h2>Live Adaptive Demo</h2>
        <p>These geometries automatically adjust based on your device capabilities:</p>
        
        <div className="live-geometry-container">
          <AdaptiveSacredGeometry
            variant="hexagon"
            size={120}
            position="top-left"
            intensity="subtle"
            enableOptimization={true}
          />
          
          <AdaptiveSacredGeometry
            variant="octagon"
            size={140}
            position="top-right"
            intensity="medium"
            enableOptimization={true}
          />
          
          <AdaptiveSacredGeometry
            variant="dodecahedron"
            size={160}
            position="center"
            intensity="strong"
            enableOptimization={true}
          />
          
          <AdaptiveSacredGeometry
            variant="pentagon"
            size={120}
            position="bottom-left"
            intensity="subtle"
            enableOptimization={true}
          />
          
          <AdaptiveSacredGeometry
            variant="icosahedron"
            size={140}
            position="bottom-right"
            intensity="medium"
            enableOptimization={true}
          />
        </div>
      </div>

      <div className="optimization-results">
        <h2>AI Optimization Results</h2>
        <p>The multi-AI analysis system examines your device and provides optimal settings:</p>
        <div className="results-grid">
          <div className="result-card">
            <h3>OpenAI Analysis</h3>
            <p>Focus on mathematical precision and device-specific calculations</p>
          </div>
          <div className="result-card">
            <h3>Anthropic Analysis</h3>
            <p>Emphasis on graceful degradation and user experience</p>
          </div>
          <div className="result-card">
            <h3>Perplexity Research</h3>
            <p>Real-time web research for latest optimization techniques</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .adaptive-geometry-demo {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
          color: white;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .demo-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #00d4ff, #0099cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .device-info {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 1px solid rgba(0,212,255,0.2);
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .info-card {
          background: rgba(0,212,255,0.1);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(0,212,255,0.2);
        }
        
        .info-card h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #00d4ff;
        }
        
        .info-card p {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }
        
        .optimization-explanation {
          margin-bottom: 40px;
        }
        
        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .strategy-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid rgba(0,212,255,0.2);
        }
        
        .strategy-card h3 {
          color: #00d4ff;
          margin-bottom: 15px;
        }
        
        .strategy-card ul {
          list-style: none;
          padding: 0;
        }
        
        .strategy-card li {
          padding: 5px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .strategy-card li:before {
          content: "▸ ";
          color: #00d4ff;
        }
        
        .geometry-showcase {
          margin-bottom: 40px;
        }
        
        .geometry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .geometry-demo-item {
          background: rgba(255,255,255,0.03);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          border: 1px solid rgba(0,212,255,0.1);
        }
        
        .geometry-container {
          height: 100px;
          position: relative;
          margin-bottom: 15px;
        }
        
        .geometry-info h4 {
          margin: 0 0 5px 0;
          color: white;
        }
        
        .complexity {
          margin: 0;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .complexity.simple {
          background: rgba(76, 175, 80, 0.2);
          color: #81c784;
        }
        
        .complexity.medium {
          background: rgba(255, 193, 7, 0.2);
          color: #ffb74d;
        }
        
        .complexity.complex {
          background: rgba(244, 67, 54, 0.2);
          color: #e57373;
        }
        
        .live-demo {
          margin-bottom: 40px;
        }
        
        .live-geometry-container {
          position: relative;
          height: 400px;
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          border: 2px solid rgba(0,212,255,0.2);
          overflow: hidden;
        }
        
        .optimization-results {
          margin-bottom: 40px;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .result-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid rgba(0,212,255,0.2);
        }
        
        .result-card h3 {
          color: #00d4ff;
          margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
          .demo-header h1 {
            font-size: 1.8rem;
          }
          
          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .strategy-grid {
            grid-template-columns: 1fr;
          }
          
          .live-geometry-container {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdaptiveGeometryDemo;