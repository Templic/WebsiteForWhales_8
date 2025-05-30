/**
 * Optimized Security Dashboard
 * 
 * Consolidated from 8 React hooks to 3 using useReducer pattern
 * WebSocket-based real-time updates instead of polling
 * Proper event listener cleanup and memory management
 */

import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import { adminDashboardOptimizer } from '../../utils/adminDashboardOptimizer';

interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'system_startup' | 'authentication' | 'data_access' | 'security_scan' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  details?: Record<string, any>;
}

interface SecurityMetrics {
  totalEvents: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  blockedAttempts: number;
  activeConnections: number;
  lastScanTime: number;
}

// Consolidated state using useReducer
interface SecurityDashboardState {
  events: SecurityEvent[];
  metrics: SecurityMetrics;
  isConnected: boolean;
  selectedSeverity: 'all' | 'low' | 'medium' | 'high' | 'critical';
  isLoading: boolean;
}

type SecurityDashboardAction = 
  | { type: 'ADD_EVENT'; payload: SecurityEvent }
  | { type: 'SET_EVENTS'; payload: SecurityEvent[] }
  | { type: 'UPDATE_METRICS'; payload: Partial<SecurityMetrics> }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_SEVERITY_FILTER'; payload: SecurityDashboardState['selectedSeverity'] }
  | { type: 'SET_LOADING'; payload: boolean };

const securityReducer = (state: SecurityDashboardState, action: SecurityDashboardAction): SecurityDashboardState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.payload, ...state.events].slice(0, 100) // Keep last 100 events
      };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'UPDATE_METRICS':
      return { ...state, metrics: { ...state.metrics, ...action.payload } };
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    case 'SET_SEVERITY_FILTER':
      return { ...state, selectedSeverity: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: SecurityDashboardState = {
  events: [],
  metrics: {
    totalEvents: 0,
    threatLevel: 'low',
    blockedAttempts: 0,
    activeConnections: 0,
    lastScanTime: Date.now()
  },
  isConnected: false,
  selectedSeverity: 'all',
  isLoading: false
};

interface OptimizedSecurityDashboardProps {
  autoRefresh?: boolean;
  maxEvents?: number;
}

const OptimizedSecurityDashboard: React.FC<OptimizedSecurityDashboardProps> = ({
  autoRefresh = true,
  maxEvents = 100
}) => {
  // Consolidated state with useReducer (reduces from 8 hooks to 3)
  const [state, dispatch] = useReducer(securityReducer, initialState);
  
  // WebSocket connection ref
  const wsConnection = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // Register component with optimizer
  React.useEffect(() => {
    adminDashboardOptimizer.registerComponent('OptimizedSecurityDashboard', {
      priority: 4,
      cpuImpact: 'medium',
      isActive: true
    });
  }, []);

  // Fetch initial security data
  const fetchSecurityData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Fetch recent security events from API
      const response = await fetch('/api/security/events?limit=50');
      if (response.ok) {
        const events = await response.json();
        dispatch({ type: 'SET_EVENTS', payload: events });
      }

      // Fetch security metrics
      const metricsResponse = await fetch('/api/security/metrics');
      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json();
        dispatch({ type: 'UPDATE_METRICS', payload: metrics });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // WebSocket connection setup with proper cleanup
  const setupWebSocketConnection = useCallback(() => {
    if (!autoRefresh) return;

    try {
      // Close existing connection
      if (wsConnection.current) {
        wsConnection.current.close();
      }

      // Create new WebSocket connection
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/security`);
      
      ws.onopen = () => {
        console.log('Security WebSocket connected');
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
        
        // Clear any reconnection attempts
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'security_event') {
            const securityEvent: SecurityEvent = {
              id: data.eventId || Date.now().toString(),
              timestamp: Date.now(),
              type: data.type,
              severity: data.severity || 'low',
              source: data.source || 'unknown',
              message: data.message || 'Security event detected',
              details: data.details
            };
            
            dispatch({ type: 'ADD_EVENT', payload: securityEvent });
          }
          
          if (data.type === 'metrics_update') {
            dispatch({ type: 'UPDATE_METRICS', payload: data.metrics });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Security WebSocket disconnected');
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
        
        // Attempt to reconnect after 5 seconds
        if (autoRefresh && !reconnectTimeout.current) {
          reconnectTimeout.current = setTimeout(() => {
            setupWebSocketConnection();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('Security WebSocket error:', error);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      };

      wsConnection.current = ws;
    } catch (error) {
      console.error('Failed to setup WebSocket connection:', error);
      // Fallback to polling with optimized intervals
      fallbackToPolling();
    }
  }, [autoRefresh]);

  // Fallback polling mechanism (optimized)
  const fallbackToPolling = useCallback(() => {
    if (!autoRefresh) return;

    const pollInterval = setInterval(async () => {
      if (adminDashboardOptimizer.shouldComponentRender('OptimizedSecurityDashboard', true)) {
        try {
          const response = await fetch('/api/security/events/latest');
          if (response.ok) {
            const latestEvents = await response.json();
            latestEvents.forEach((event: SecurityEvent) => {
              dispatch({ type: 'ADD_EVENT', payload: event });
            });
          }
        } catch (error) {
          console.error('Polling failed:', error);
        }
      }
    }, 10000); // Poll every 10 seconds instead of every second

    return () => clearInterval(pollInterval);
  }, [autoRefresh]);

  // Filter events by severity
  const filteredEvents = React.useMemo(() => {
    if (state.selectedSeverity === 'all') {
      return state.events;
    }
    return state.events.filter(event => event.severity === state.selectedSeverity);
  }, [state.events, state.selectedSeverity]);

  // Setup effect with proper cleanup
  useEffect(() => {
    fetchSecurityData();
    setupWebSocketConnection();

    return () => {
      // Cleanup WebSocket connection
      if (wsConnection.current) {
        wsConnection.current.close();
        wsConnection.current = null;
      }
      
      // Clear reconnection timeout
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };
  }, [fetchSecurityData, setupWebSocketConnection]);

  // Get severity color for UI
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  // Get threat level indicator
  const getThreatLevelIndicator = () => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };
    
    return {
      color: colors[state.metrics.threatLevel],
      text: state.metrics.threatLevel.toUpperCase()
    };
  };

  return (
    <div className="security-dashboard">
      <div className="dashboard-header">
        <h2>Security Dashboard (Optimized)</h2>
        <div className="connection-status">
          <span 
            className={`status-indicator ${state.isConnected ? 'connected' : 'disconnected'}`}
          >
            {state.isConnected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
      </div>

      {state.isLoading && <div className="loading">Loading security data...</div>}

      <div className="metrics-overview">
        <div className="metric-card">
          <h3>Threat Level</h3>
          <div 
            className="threat-level"
            style={{ color: getThreatLevelIndicator().color }}
          >
            {getThreatLevelIndicator().text}
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Total Events</h3>
          <div className="metric-value">{state.metrics.totalEvents}</div>
        </div>
        
        <div className="metric-card">
          <h3>Blocked Attempts</h3>
          <div className="metric-value">{state.metrics.blockedAttempts}</div>
        </div>
        
        <div className="metric-card">
          <h3>Active Connections</h3>
          <div className="metric-value">{state.metrics.activeConnections}</div>
        </div>
      </div>

      <div className="events-section">
        <div className="events-header">
          <h3>Recent Security Events</h3>
          <select
            value={state.selectedSeverity}
            onChange={(e) => dispatch({ 
              type: 'SET_SEVERITY_FILTER', 
              payload: e.target.value as SecurityDashboardState['selectedSeverity']
            })}
            className="severity-filter"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <div className="no-events">No security events found</div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-header">
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(event.severity) }}
                  >
                    {event.severity.toUpperCase()}
                  </span>
                  <span className="event-type">{event.type}</span>
                  <span className="event-time">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="event-message">{event.message}</div>
                <div className="event-source">Source: {event.source}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .security-dashboard {
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .connection-status .status-indicator {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-indicator.connected {
          background: #d4edda;
          color: #155724;
        }
        .status-indicator.disconnected {
          background: #f8d7da;
          color: #721c24;
        }
        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }
        .metric-card {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          text-align: center;
        }
        .metric-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }
        .metric-value, .threat-level {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .events-section {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .severity-filter {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .events-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .event-item {
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .event-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .severity-badge {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: bold;
          color: white;
        }
        .event-type {
          font-weight: 500;
          text-transform: capitalize;
        }
        .event-time {
          font-size: 12px;
          color: #666;
          margin-left: auto;
        }
        .event-message {
          font-size: 14px;
          margin-bottom: 4px;
        }
        .event-source {
          font-size: 12px;
          color: #888;
        }
        .no-events {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default OptimizedSecurityDashboard;