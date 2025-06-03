/**
 * Integrated Security Dashboard
 * 
 * Real-time security monitoring with threat detection, event logging,
 * and comprehensive security analytics
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Ban,
  Activity,
  Clock,
  MapPin,
  User,
  Globe,
  Terminal,
  Database,
  Server,
  Wifi,
  HardDrive
} from 'lucide-react';

interface SecurityEvent {
  id: number;
  eventType: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  metadata?: Record<string, any>;
  resolved: boolean;
  createdAt: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  resolvedEvents: number;
  activeThreats: number;
  lastScanTime: string;
}

interface ThreatAnalysis {
  topThreats: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  ipAnalysis: Array<{
    ip: string;
    eventCount: number;
    threatLevel: string;
    blocked: boolean;
  }>;
  geographicDistribution: Array<{
    country: string;
    eventCount: number;
    threatLevel: string;
  }>;
}

export function IntegratedSecurityDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Security data queries
  const { data: securityEvents, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['/api/security/events', selectedTimeRange, searchTerm, filterLevel],
    refetchInterval: 30000 // Refresh every 30 seconds for real-time monitoring
  });

  const { data: securityMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/security/metrics', selectedTimeRange],
    refetchInterval: 30000
  });

  const { data: threatAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['/api/security/analysis', selectedTimeRange],
    refetchInterval: 60000 // Refresh every minute
  });

  // Security actions
  const resolveEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/security/events/${eventId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to resolve event');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Event resolved", description: "Security event marked as resolved" });
      queryClient.invalidateQueries({ queryKey: ['/api/security/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/security/metrics'] });
    }
  });

  const blockIpMutation = useMutation({
    mutationFn: async (ipAddress: string) => {
      const response = await fetch('/api/security/block-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress })
      });
      if (!response.ok) throw new Error('Failed to block IP');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "IP blocked", description: "IP address has been blocked" });
      queryClient.invalidateQueries({ queryKey: ['/api/security/analysis'] });
    }
  });

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Shield className="h-4 w-4" />;
      case 'medium': return <Eye className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time threat monitoring and security analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchEvents()}
            disabled={eventsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${eventsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? '...' : securityMetrics?.totalEvents || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metricsLoading ? '...' : securityMetrics?.criticalThreats || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Shield className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metricsLoading ? '...' : securityMetrics?.activeThreats || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metricsLoading ? '...' : securityMetrics?.resolvedEvents || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Threats</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="text-center py-4">Loading threat analysis...</div>
            ) : (
              <div className="space-y-3">
                {threatAnalysis?.topThreats?.slice(0, 5).map((threat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getThreatIcon(threat.severity)}
                      <span className="text-sm">{formatEventType(threat.type)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getThreatLevelColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                      <span className="text-sm font-medium">{threat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suspicious IPs</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="text-center py-4">Loading IP analysis...</div>
            ) : (
              <div className="space-y-3">
                {threatAnalysis?.ipAnalysis?.slice(0, 5).map((ip, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-mono">{ip.ip}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{ip.eventCount} events</span>
                      {!ip.blocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => blockIpMutation.mutate(ip.ip)}
                          disabled={blockIpMutation.isPending}
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="text-center py-4">Loading geographic data...</div>
            ) : (
              <div className="space-y-3">
                {threatAnalysis?.geographicDistribution?.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{location.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getThreatLevelColor(location.threatLevel)}>
                        {location.threatLevel}
                      </Badge>
                      <span className="text-sm">{location.eventCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="text-center py-8">Loading security events...</div>
          ) : (
            <div className="space-y-3">
              {securityEvents?.map((event: SecurityEvent) => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getThreatIcon(event.threatLevel)}
                      <Badge className={getThreatLevelColor(event.threatLevel)}>
                        {event.threatLevel}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium">{formatEventType(event.eventType)}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{event.ipAddress}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(event.createdAt).toLocaleString()}</span>
                        </span>
                        {event.location?.country && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location.country}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.resolved ? (
                      <Badge variant="outline" className="text-green-600">
                        Resolved
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveEventMutation.mutate(event.id);
                        }}
                        disabled={resolveEventMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Security Event Details</h3>
              <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Type</label>
                  <p className="text-sm">{formatEventType(selectedEvent.eventType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Threat Level</label>
                  <Badge className={getThreatLevelColor(selectedEvent.threatLevel)}>
                    {selectedEvent.threatLevel}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm font-mono">{selectedEvent.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm">{new Date(selectedEvent.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedEvent.userAgent && (
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <p className="text-sm text-muted-foreground">{selectedEvent.userAgent}</p>
                </div>
              )}
              
              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div>
                  <label className="text-sm font-medium">Metadata</label>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}