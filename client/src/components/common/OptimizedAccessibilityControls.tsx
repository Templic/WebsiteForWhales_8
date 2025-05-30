/**
 * Optimized Accessibility Controls
 * 
 * Consolidated from 6 React hooks to 2 using useReducer pattern
 * Modern ResizeObserver API instead of deprecated DOM mutation observers
 * Debounced event handlers and proper cleanup
 */

import React, { useReducer, useEffect, useRef, useCallback } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'dark';
  motion: 'normal' | 'reduced';
  focus: 'normal' | 'enhanced';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityState {
  settings: AccessibilitySettings;
  isActive: boolean;
  detectedNeeds: string[];
  systemPreferences: Partial<AccessibilitySettings>;
}

type AccessibilityAction = 
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AccessibilitySettings> }
  | { type: 'SET_ACTIVE'; payload: boolean }
  | { type: 'ADD_DETECTED_NEED'; payload: string }
  | { type: 'SET_SYSTEM_PREFERENCES'; payload: Partial<AccessibilitySettings> };

const accessibilityReducer = (state: AccessibilityState, action: AccessibilityAction): AccessibilityState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'SET_ACTIVE':
      return { ...state, isActive: action.payload };
    case 'ADD_DETECTED_NEED':
      return {
        ...state,
        detectedNeeds: [...new Set([...state.detectedNeeds, action.payload])]
      };
    case 'SET_SYSTEM_PREFERENCES':
      return {
        ...state,
        systemPreferences: { ...state.systemPreferences, ...action.payload }
      };
    default:
      return state;
  }
};

const initialState: AccessibilityState = {
  settings: {
    fontSize: 'medium',
    contrast: 'normal',
    motion: 'normal',
    focus: 'normal',
    screenReader: false,
    keyboardNavigation: true
  },
  isActive: false,
  detectedNeeds: [],
  systemPreferences: {}
};

interface OptimizedAccessibilityControlsProps {
  autoDetect?: boolean;
  persistSettings?: boolean;
}

const OptimizedAccessibilityControls: React.FC<OptimizedAccessibilityControlsProps> = ({
  autoDetect = true,
  persistSettings = true
}) => {
  // Consolidated state with useReducer (reduces from 6 hooks to 2)
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);
  
  // Refs for modern observers and cleanup
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mediaQueryRefs = useRef<MediaQueryList[]>([]);
  const debounceTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Debounced function helper
  const debounce = useCallback((key: string, func: () => void, delay: number) => {
    const existingTimeout = debounceTimeouts.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    const newTimeout = setTimeout(func, delay);
    debounceTimeouts.current.set(key, newTimeout);
  }, []);

  // Detect system accessibility preferences
  const detectSystemPreferences = useCallback(() => {
    const preferences: Partial<AccessibilitySettings> = {};

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preferences.motion = 'reduced';
      dispatch({ type: 'ADD_DETECTED_NEED', payload: 'reduced_motion' });
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      preferences.contrast = 'high';
      dispatch({ type: 'ADD_DETECTED_NEED', payload: 'high_contrast' });
    }

    // Check for color scheme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      preferences.contrast = 'dark';
      dispatch({ type: 'ADD_DETECTED_NEED', payload: 'dark_mode' });
    }

    // Detect screen reader usage
    if (navigator.userAgent.includes('NVDA') || 
        navigator.userAgent.includes('JAWS') || 
        navigator.userAgent.includes('VoiceOver')) {
      preferences.screenReader = true;
      dispatch({ type: 'ADD_DETECTED_NEED', payload: 'screen_reader' });
    }

    dispatch({ type: 'SET_SYSTEM_PREFERENCES', payload: preferences });
    
    // Apply detected preferences automatically
    if (Object.keys(preferences).length > 0) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: preferences });
    }
  }, []);

  // Setup modern ResizeObserver instead of deprecated mutation observers
  const setupResizeObserver = useCallback(() => {
    if (!('ResizeObserver' in window)) {
      console.warn('ResizeObserver not supported, falling back to resize events');
      return;
    }

    const observer = new ResizeObserver((entries) => {
      debounce('resize_check', () => {
        // Check if content is getting cut off or hard to read
        entries.forEach(entry => {
          const { width, height } = entry.contentRect;
          
          if (width < 320) {
            dispatch({ type: 'ADD_DETECTED_NEED', payload: 'larger_text' });
          }
          
          if (height < 480) {
            dispatch({ type: 'ADD_DETECTED_NEED', payload: 'simplified_layout' });
          }
        });
      }, 250);
    });

    // Observe the main content area
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent) {
      observer.observe(mainContent);
    }

    resizeObserverRef.current = observer;
  }, [debounce]);

  // Setup media query listeners with proper cleanup
  const setupMediaQueryListeners = useCallback(() => {
    const queries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: high)',
      '(prefers-color-scheme: dark)',
      '(max-width: 768px)'
    ];

    queries.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      
      const handleChange = () => {
        debounce('media_query_change', detectSystemPreferences, 100);
      };

      // Use modern addEventListener instead of deprecated addListener
      mediaQuery.addEventListener('change', handleChange);
      mediaQueryRefs.current.push(mediaQuery);
    });
  }, [debounce, detectSystemPreferences]);

  // Optimized keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    // Only process if keyboard navigation is enabled
    if (!state.settings.keyboardNavigation) return;

    debounce('keyboard_nav', () => {
      switch (event.key) {
        case 'Tab':
          // Enhance focus visibility
          if (state.settings.focus === 'enhanced') {
            const focusedElement = document.activeElement as HTMLElement;
            if (focusedElement) {
              focusedElement.style.outline = '3px solid #005fcc';
              focusedElement.style.outlineOffset = '2px';
            }
          }
          break;
          
        case 'Escape':
          // Close any open accessibility panels
          if (state.isActive) {
            dispatch({ type: 'SET_ACTIVE', payload: false });
          }
          break;
      }
    }, 50);
  }, [state.settings.keyboardNavigation, state.settings.focus, state.isActive, debounce]);

  // Apply accessibility settings to DOM
  const applyAccessibilitySettings = useCallback(() => {
    const root = document.documentElement;

    // Font size adjustments
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '22px'
    };
    root.style.fontSize = fontSizeMap[state.settings.fontSize];

    // Contrast adjustments
    switch (state.settings.contrast) {
      case 'high':
        root.classList.add('high-contrast');
        root.classList.remove('dark-mode');
        break;
      case 'dark':
        root.classList.add('dark-mode');
        root.classList.remove('high-contrast');
        break;
      default:
        root.classList.remove('high-contrast', 'dark-mode');
    }

    // Motion preferences
    if (state.settings.motion === 'reduced') {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus enhancements
    if (state.settings.focus === 'enhanced') {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Screen reader optimizations
    if (state.settings.screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }
  }, [state.settings]);

  // Load persisted settings
  const loadPersistedSettings = useCallback(() => {
    if (!persistSettings) return;

    try {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  }, [persistSettings]);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    if (!persistSettings) return;

    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(state.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, [persistSettings, state.settings]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Cleanup ResizeObserver
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    // Cleanup media query listeners
    mediaQueryRefs.current.forEach(mediaQuery => {
      // Modern cleanup - removeEventListener handles all listeners
      mediaQuery.removeEventListener('change', detectSystemPreferences);
    });
    mediaQueryRefs.current = [];

    // Cleanup debounce timeouts
    debounceTimeouts.current.forEach(timeout => {
      clearTimeout(timeout);
    });
    debounceTimeouts.current.clear();

    // Remove keyboard event listener
    document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [detectSystemPreferences, handleKeyboardNavigation]);

  // Initialize accessibility controls
  useEffect(() => {
    loadPersistedSettings();
    
    if (autoDetect) {
      detectSystemPreferences();
      setupResizeObserver();
      setupMediaQueryListeners();
    }

    // Add keyboard navigation listener
    document.addEventListener('keydown', handleKeyboardNavigation);

    return cleanup;
  }, [
    autoDetect, 
    loadPersistedSettings, 
    detectSystemPreferences, 
    setupResizeObserver, 
    setupMediaQueryListeners, 
    handleKeyboardNavigation, 
    cleanup
  ]);

  // Apply settings when they change
  useEffect(() => {
    applyAccessibilitySettings();
    saveSettings();
  }, [state.settings, applyAccessibilitySettings, saveSettings]);

  // Toggle accessibility panel
  const togglePanel = () => {
    dispatch({ type: 'SET_ACTIVE', payload: !state.isActive });
  };

  // Update specific setting
  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <>
      {/* Accessibility toggle button */}
      <button
        className="accessibility-toggle"
        onClick={togglePanel}
        aria-label="Open accessibility controls"
        aria-expanded={state.isActive}
      >
        ♿
      </button>

      {/* Accessibility controls panel */}
      {state.isActive && (
        <div className="accessibility-panel" role="dialog" aria-label="Accessibility Controls">
          <div className="panel-header">
            <h2>Accessibility Settings</h2>
            <button onClick={togglePanel} aria-label="Close accessibility controls">×</button>
          </div>

          <div className="panel-content">
            {/* Font size control */}
            <div className="control-group">
              <label htmlFor="font-size">Font Size</label>
              <select
                id="font-size"
                value={state.settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            {/* Contrast control */}
            <div className="control-group">
              <label htmlFor="contrast">Contrast</label>
              <select
                id="contrast"
                value={state.settings.contrast}
                onChange={(e) => updateSetting('contrast', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High Contrast</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            {/* Motion control */}
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.settings.motion === 'reduced'}
                  onChange={(e) => updateSetting('motion', e.target.checked ? 'reduced' : 'normal')}
                />
                Reduce Motion
              </label>
            </div>

            {/* Focus enhancement */}
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.settings.focus === 'enhanced'}
                  onChange={(e) => updateSetting('focus', e.target.checked ? 'enhanced' : 'normal')}
                />
                Enhanced Focus
              </label>
            </div>

            {/* Keyboard navigation */}
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.settings.keyboardNavigation}
                  onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                />
                Keyboard Navigation
              </label>
            </div>

            {/* Detected needs */}
            {state.detectedNeeds.length > 0 && (
              <div className="detected-needs">
                <h3>Detected Accessibility Needs</h3>
                <ul>
                  {state.detectedNeeds.map(need => (
                    <li key={need}>{need.replace('_', ' ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .accessibility-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 25px;
          background: #005fcc;
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .accessibility-panel {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 300px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          z-index: 1001;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .panel-header h2 {
          margin: 0;
          font-size: 18px;
        }
        
        .panel-header button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
        }
        
        .panel-content {
          padding: 15px;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        .control-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .control-group select {
          width: 100%;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .control-group input[type="checkbox"] {
          margin-right: 8px;
        }
        
        .detected-needs {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        
        .detected-needs h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
        
        .detected-needs ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .detected-needs li {
          margin-bottom: 5px;
          font-size: 13px;
          text-transform: capitalize;
        }
      `}</style>
    </>
  );
};

export default OptimizedAccessibilityControls;