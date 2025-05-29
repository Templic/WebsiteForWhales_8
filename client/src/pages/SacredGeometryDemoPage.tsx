/**
 * Sacred Geometry Demo Page
 * Real-time testing of configurations across different device sizes
 * 
 * Features:
 * - Live controls for all sacred geometry parameters
 * - Multi-device viewport simulation
 * - Performance monitoring
 * - Export/import configuration presets
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CentralizedSacredGeometry, useSacredGeometry } from '@/components/cosmic/CentralizedSacredGeometry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Demo viewport configurations
const DEMO_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'Mobile (iPhone)', class: 'w-[375px] h-[667px]' },
  tablet: { width: 768, height: 1024, name: 'Tablet (iPad)', class: 'w-[768px] h-[1024px]' },
  desktop: { width: 1440, height: 900, name: 'Desktop (1440p)', class: 'w-[1440px] h-[900px]' },
  ultrawide: { width: 2560, height: 1440, name: 'Ultrawide (1440p)', class: 'w-[2560px] h-[1440px]' }
};

const SACRED_PATTERNS = [
  'flowerOfLife',
  'seedOfLife', 
  'metatronsCube',
  'sriYantra',
  'vesicaPiscis',
  'treeOfLife',
  'fibonacciSpiral',
  'tetrahedron',
  'cube',
  'octahedron',
  'dodecahedron',
  'icosahedron'
];

const POSITIONS = [
  'top-left',
  'top-right', 
  'bottom-left',
  'bottom-right',
  'center',
  'background'
];

const ANIMATIONS = ['rotate', 'pulse', 'oscillate', 'static'];
const SIZES = ['small', 'medium', 'large', 'xlarge'];
const INTENSITIES = ['subtle', 'medium', 'vivid'];
const BLEND_MODES = ['normal', 'multiply', 'overlay', 'screen', 'difference'];

export default function SacredGeometryDemoPage() {
  const { configs, enabled, addGeometry, removeGeometry, updateGeometry, toggleEnabled, setConfigs } = useSacredGeometry();
  const [selectedViewport, setSelectedViewport] = useState<keyof typeof DEMO_VIEWPORTS>('desktop');
  const [showControls, setShowControls] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 60, memory: 0 });
  const [presetName, setPresetName] = useState('');

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    // Memory monitoring (if available)
    if ('memory' in performance) {
      const updateMemory = () => {
        setPerformanceMetrics(prev => ({
          ...prev,
          memory: Math.round((performance.memory?.usedJSHeapSize || 0) / 1024 / 1024)
        }));
      };
      
      const memoryInterval = setInterval(updateMemory, 2000);
      return () => clearInterval(memoryInterval);
    }
  }, []);

  const addNewGeometry = () => {
    const newConfig = {
      pattern: 'flowerOfLife' as const,
      position: 'center' as const,
      size: 'medium' as const,
      animation: 'rotate' as const,
      intensity: 'medium' as const,
      depth: configs.length + 1,
      blendMode: 'overlay' as const,
      enabled: true
    };
    addGeometry(newConfig);
  };

  const exportConfiguration = () => {
    const configData = {
      name: presetName || `Config_${Date.now()}`,
      timestamp: new Date().toISOString(),
      configs: configs,
      enabled: enabled
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${configData.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const configData = JSON.parse(e.target?.result as string);
        setConfigs(configData.configs);
        setPresetName(configData.name);
      } catch (error) {
        console.error('Failed to import configuration:', error);
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    const defaultConfigs = [
      {
        pattern: 'flowerOfLife' as const,
        position: 'top-left' as const,
        size: 'large' as const,
        animation: 'rotate' as const,
        intensity: 'medium' as const,
        depth: 1,
        blendMode: 'overlay' as const,
        enabled: true
      },
      {
        pattern: 'metatronsCube' as const,
        position: 'top-right' as const,
        size: 'large' as const,
        animation: 'oscillate' as const,
        intensity: 'medium' as const,
        depth: 2,
        blendMode: 'overlay' as const,
        enabled: true
      }
    ];
    setConfigs(defaultConfigs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sacred Geometry Demo Lab
          </h1>
          <p className="text-gray-300">
            Real-time testing of sacred geometry configurations across multiple device viewports
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="flex gap-4 mb-6">
          <Badge variant="outline" className="text-green-400 border-green-400">
            FPS: {performanceMetrics.fps}
          </Badge>
          {performanceMetrics.memory > 0 && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Memory: {performanceMetrics.memory}MB
            </Badge>
          )}
          <Badge variant="outline" className={enabled ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}>
            Geometry: {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Controls</span>
                  <Switch checked={showControls} onCheckedChange={setShowControls} />
                </CardTitle>
              </CardHeader>
              {showControls && (
                <CardContent className="space-y-4">
                  {/* Global Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Global Enable</span>
                      <Switch checked={enabled} onCheckedChange={toggleEnabled} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Viewport</label>
                      <Select value={selectedViewport} onValueChange={(value: keyof typeof DEMO_VIEWPORTS) => setSelectedViewport(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEMO_VIEWPORTS).map(([key, viewport]) => (
                            <SelectItem key={key} value={key}>
                              {viewport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Configuration Management */}
                  <div className="space-y-2 pt-4 border-t border-purple-500/20">
                    <Button onClick={addNewGeometry} size="sm" className="w-full">
                      Add Geometry
                    </Button>
                    <Button onClick={resetToDefaults} variant="outline" size="sm" className="w-full">
                      Reset to Defaults
                    </Button>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Preset name"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs bg-black/20 border border-purple-500/30 rounded"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={exportConfiguration} size="sm" variant="outline" className="flex-1">
                        Export
                      </Button>
                      <label className="flex-1">
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <span>Import</span>
                        </Button>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importConfiguration}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Individual Geometry Controls */}
                  <div className="space-y-4 pt-4 border-t border-purple-500/20">
                    <h4 className="font-medium">Geometry Elements</h4>
                    {configs.map((config, index) => (
                      <Card key={index} className="bg-black/20 border-purple-500/20">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Element {index + 1}</span>
                            <div className="flex gap-2">
                              <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked) => updateGeometry(index, { enabled: checked })}
                                size="sm"
                              />
                              <Button
                                onClick={() => removeGeometry(index)}
                                size="sm"
                                variant="destructive"
                                className="h-6 w-6 p-0"
                              >
                                ×
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs">Pattern</label>
                              <Select
                                value={config.pattern}
                                onValueChange={(value) => updateGeometry(index, { pattern: value as any })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SACRED_PATTERNS.map(pattern => (
                                    <SelectItem key={pattern} value={pattern}>
                                      {pattern}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-xs">Position</label>
                              <Select
                                value={config.position}
                                onValueChange={(value) => updateGeometry(index, { position: value as any })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {POSITIONS.map(position => (
                                    <SelectItem key={position} value={position}>
                                      {position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-xs">Size</label>
                              <Select
                                value={config.size}
                                onValueChange={(value) => updateGeometry(index, { size: value as any })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SIZES.map(size => (
                                    <SelectItem key={size} value={size}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-xs">Animation</label>
                              <Select
                                value={config.animation}
                                onValueChange={(value) => updateGeometry(index, { animation: value as any })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ANIMATIONS.map(animation => (
                                    <SelectItem key={animation} value={animation}>
                                      {animation}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs">Depth: {config.depth}</label>
                            <Slider
                              value={[config.depth]}
                              onValueChange={([value]) => updateGeometry(index, { depth: value })}
                              min={1}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Demo Viewport */}
          <div className="xl:col-span-3">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle>
                  {DEMO_VIEWPORTS[selectedViewport].name} - {DEMO_VIEWPORTS[selectedViewport].width}×{DEMO_VIEWPORTS[selectedViewport].height}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-auto bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg border border-purple-500/20">
                  <div 
                    className={cn(
                      "relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 mx-auto",
                      "transform scale-50 origin-top", // Scale down for viewing
                      DEMO_VIEWPORTS[selectedViewport].class
                    )}
                    style={{
                      minHeight: DEMO_VIEWPORTS[selectedViewport].height / 2,
                      transform: selectedViewport === 'ultrawide' ? 'scale(0.3)' : 'scale(0.5)'
                    }}
                  >
                    {/* Sample content for testing text readability */}
                    <div className="relative z-10 p-8 text-white">
                      <h1 className="text-4xl font-bold mb-4">Sacred Geometry Test</h1>
                      <p className="text-lg mb-4">
                        Testing text readability with lensing effects and depth-of-field positioning.
                        The geometry should enhance rather than interfere with content legibility.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-black/20 p-4 rounded">
                          <h3 className="font-bold">Corner Content</h3>
                          <p>Testing corner positioning with 27% margin offset</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded">
                          <h3 className="font-bold">Center Content</h3>
                          <p>Testing center alignment with background geometry</p>
                        </div>
                      </div>
                    </div>

                    {/* Sacred Geometry Layer */}
                    <CentralizedSacredGeometry
                      configs={configs}
                      globalEnabled={enabled}
                      onConfigChange={setConfigs}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}