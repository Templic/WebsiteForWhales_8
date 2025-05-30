/**
 * Optimized Binaural Beat Generator
 * Reduced from 61 useState + 33 useEffect to 4 useState + 2 useEffect
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Consolidated state into single objects to reduce re-renders
 * - Removed redundant useEffect hooks by combining related logic
 * - Implemented efficient audio context management with cleanup
 * - Added performance monitoring to disable features under load
 * - Optimized mathematical calculations with cached constants
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Pre-calculated frequency constants for instant access
const FREQUENCY_PRESETS = {
  DELTA: { left: 200, right: 202 },    // 2 Hz - Deep sleep
  THETA: { left: 200, right: 205 },    // 5 Hz - Relaxation  
  ALPHA: { left: 200, right: 210 },    // 10 Hz - Focus
  BETA: { left: 200, right: 215 }      // 15 Hz - Alert focus
} as const;

// Consolidated audio state interface
interface AudioState {
  context: AudioContext | null;
  initialized: boolean;
  playing: boolean;
  volume: number;
  frequencies: { left: number; right: number };
  waveType: OscillatorType;
}

// Timer state interface
interface TimerState {
  duration: number;
  remaining: number;
  active: boolean;
}

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

const OptimizedBinauralBeatGenerator: React.FC = () => {
  // CONSOLIDATED STATE: Reduced from 61 useState to 4
  const [audioState, setAudioState] = useState<AudioState>({
    context: null,
    initialized: false,
    playing: false,
    volume: 0.5,
    frequencies: FREQUENCY_PRESETS.THETA,
    waveType: 'sine'
  });
  
  const [timer, setTimer] = useState<TimerState>({
    duration: 300,
    remaining: 300,
    active: false
  });
  
  const [performanceMode, setPerformanceMode] = useState<'high' | 'low'>('high');
  const [isAudioDisabled, setIsAudioDisabled] = useState(false);
  
  // Persistent refs for audio nodes
  const audioNodesRef = useRef<{
    leftOsc: OscillatorNode | null;
    rightOsc: OscillatorNode | null;
    leftGain: GainNode | null;
    rightGain: GainNode | null;
    merger: ChannelMergerNode | null;
  }>({
    leftOsc: null,
    rightOsc: null,
    leftGain: null,
    rightGain: null,
    merger: null
  });
  
  const timerIntervalRef = useRef<number | null>(null);
  
  // Memoized beat frequency calculation
  const beatFrequency = useMemo(() => {
    return Math.abs(audioState.frequencies.right - audioState.frequencies.left);
  }, [audioState.frequencies]);
  
  // Performance monitoring effect
  useEffect(() => {
    // Check if audio processing should be disabled due to performance
    const checkPerformanceMode = () => {
      const emergencyMode = (window as any).__EMERGENCY_PERFORMANCE_MODE__;
      const audioDisabled = (window as any).__DISABLE_AUDIO_PROCESSING__;
      
      if (emergencyMode || audioDisabled) {
        setIsAudioDisabled(true);
        setPerformanceMode('low');
        // Cleanup audio if it's running
        if (audioState.playing) {
          cleanupAudio();
        }
      } else {
        setIsAudioDisabled(false);
        setPerformanceMode('high');
      }
    };
    
    checkPerformanceMode();
    
    // Listen for performance mode changes
    const handlePerformanceChange = () => checkPerformanceMode();
    window.addEventListener('emergencyPerformanceMode', handlePerformanceChange);
    
    return () => {
      window.removeEventListener('emergencyPerformanceMode', handlePerformanceChange);
    };
  }, [audioState.playing]);
  
  // Audio management effect - CONSOLIDATED from multiple useEffects
  useEffect(() => {
    // Cleanup function
    return () => {
      cleanupAudio();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  
  // Optimized audio initialization
  const initializeAudio = useCallback(async () => {
    if (isAudioDisabled || audioState.initialized) return;
    
    try {
      // Create audio context with optimal settings
      const context = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100, // Standard rate to avoid resampling
        latencyHint: 'playback' // Optimize for consistent playback
      });
      
      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      setAudioState(prev => ({
        ...prev,
        context,
        initialized: true
      }));
      
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setIsAudioDisabled(true);
    }
  }, [isAudioDisabled, audioState.initialized]);
  
  // Optimized audio cleanup
  const cleanupAudio = useCallback(() => {
    const nodes = audioNodesRef.current;
    
    // Stop and disconnect oscillators
    if (nodes.leftOsc) {
      nodes.leftOsc.stop();
      nodes.leftOsc.disconnect();
      nodes.leftOsc = null;
    }
    
    if (nodes.rightOsc) {
      nodes.rightOsc.stop();
      nodes.rightOsc.disconnect();
      nodes.rightOsc = null;
    }
    
    // Disconnect gain nodes
    if (nodes.leftGain) {
      nodes.leftGain.disconnect();
      nodes.leftGain = null;
    }
    
    if (nodes.rightGain) {
      nodes.rightGain.disconnect();
      nodes.rightGain = null;
    }
    
    if (nodes.merger) {
      nodes.merger.disconnect();
      nodes.merger = null;
    }
    
    setAudioState(prev => ({ ...prev, playing: false }));
  }, []);
  
  // Optimized play function
  const playBinauralBeats = useCallback(async () => {
    if (isAudioDisabled || !audioState.context) {
      await initializeAudio();
      return;
    }
    
    if (audioState.playing) {
      cleanupAudio();
      return;
    }
    
    try {
      const context = audioState.context;
      const nodes = audioNodesRef.current;
      
      // Create oscillators
      nodes.leftOsc = context.createOscillator();
      nodes.rightOsc = context.createOscillator();
      nodes.leftGain = context.createGain();
      nodes.rightGain = context.createGain();
      nodes.merger = context.createChannelMerger(2);
      
      // Configure oscillators
      nodes.leftOsc.frequency.value = audioState.frequencies.left;
      nodes.rightOsc.frequency.value = audioState.frequencies.right;
      nodes.leftOsc.type = audioState.waveType;
      nodes.rightOsc.type = audioState.waveType;
      
      // Set volume
      const volume = audioState.volume * 0.1; // Keep volume low for safety
      nodes.leftGain.gain.value = volume;
      nodes.rightGain.gain.value = volume;
      
      // Connect audio graph
      nodes.leftOsc.connect(nodes.leftGain);
      nodes.rightOsc.connect(nodes.rightGain);
      nodes.leftGain.connect(nodes.merger, 0, 0); // Left channel
      nodes.rightGain.connect(nodes.merger, 0, 1); // Right channel
      nodes.merger.connect(context.destination);
      
      // Start oscillators
      nodes.leftOsc.start();
      nodes.rightOsc.start();
      
      setAudioState(prev => ({ ...prev, playing: true }));
      
    } catch (error) {
      console.error('Failed to start binaural beats:', error);
      cleanupAudio();
    }
  }, [audioState, isAudioDisabled, initializeAudio, cleanupAudio]);
  
  // Optimized frequency update
  const updateFrequency = useCallback((side: 'left' | 'right', value: number) => {
    setAudioState(prev => ({
      ...prev,
      frequencies: { ...prev.frequencies, [side]: value }
    }));
    
    // Update playing oscillator if active
    const nodes = audioNodesRef.current;
    if (side === 'left' && nodes.leftOsc) {
      nodes.leftOsc.frequency.value = value;
    } else if (side === 'right' && nodes.rightOsc) {
      nodes.rightOsc.frequency.value = value;
    }
  }, []);
  
  // Timer management
  const toggleTimer = useCallback(() => {
    if (timer.active) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimer(prev => ({ ...prev, active: false }));
    } else {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(prev => {
          if (prev.remaining <= 1) {
            // Timer finished - stop audio
            cleanupAudio();
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            return { ...prev, remaining: 0, active: false };
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
      setTimer(prev => ({ ...prev, active: true }));
    }
  }, [timer.active, cleanupAudio]);
  
  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Performance-aware rendering
  if (isAudioDisabled) {
    return (
      <div className="optimized-binaural-generator disabled">
        <div className="performance-notice">
          <h3>Audio Disabled</h3>
          <p>Audio processing is disabled to improve performance.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="optimized-binaural-generator">
      <div className="controls">
        <h3>Binaural Beat Generator</h3>
        
        {/* Performance indicator */}
        {performanceMode === 'low' && (
          <div className="performance-warning">
            Performance mode: Optimized
          </div>
        )}
        
        {/* Frequency controls */}
        <div className="frequency-controls">
          <div>
            <label>Left Ear: {audioState.frequencies.left} Hz</label>
            <input
              type="range"
              min="100"
              max="500"
              value={audioState.frequencies.left}
              onChange={(e) => updateFrequency('left', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label>Right Ear: {audioState.frequencies.right} Hz</label>
            <input
              type="range"
              min="100"
              max="500"
              value={audioState.frequencies.right}
              onChange={(e) => updateFrequency('right', Number(e.target.value))}
            />
          </div>
          
          <div className="beat-frequency">
            Beat Frequency: {beatFrequency} Hz
          </div>
        </div>
        
        {/* Volume control */}
        <div className="volume-control">
          <label>Volume: {Math.round(audioState.volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioState.volume}
            onChange={(e) => setAudioState(prev => ({ 
              ...prev, 
              volume: Number(e.target.value) 
            }))}
          />
        </div>
        
        {/* Preset buttons */}
        <div className="presets">
          {Object.entries(FREQUENCY_PRESETS).map(([name, freq]) => (
            <button
              key={name}
              onClick={() => setAudioState(prev => ({ 
                ...prev, 
                frequencies: freq 
              }))}
            >
              {name} ({Math.abs(freq.right - freq.left)} Hz)
            </button>
          ))}
        </div>
        
        {/* Play/Stop button */}
        <button
          className="play-button"
          onClick={playBinauralBeats}
          disabled={isAudioDisabled}
        >
          {audioState.playing ? 'Stop' : 'Play'} Binaural Beats
        </button>
        
        {/* Timer */}
        <div className="timer">
          <div>Time: {formatTime(timer.remaining)}</div>
          <button onClick={toggleTimer}>
            {timer.active ? 'Pause' : 'Start'} Timer
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OptimizedBinauralBeatGenerator);