import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Users, 
  Database,
  Server,
  Eye,
  RefreshCw,
  CheckCircle
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  metadata: any;
  createdAt: string;
}

interface SystemHealth {
  status: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  timestamp: string;
}

export function SecurityDashboard() {
  const { data: securityEvents, isLoading: eventsLoading, refetch: refetchEvents } = useQuery<SecurityEvent[]>({
    queryKey: ["/api/admin/security/events"],
    retry: 1,
  });

  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = useQuery<SystemHealth>({
    queryKey: ["/api/admin/security/health"],
    retry: 1,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const recentEvents = securityEvents?.slice(0, 5) || [];
  const criticalEvents = securityEvents?.filter(event => event.severity === 'critical').length || 0;
  const totalEvents = securityEvents?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system security, threats, and access control
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetchEvents()}
            disabled={eventsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${eventsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {criticalEvents === 0 ? 'Secure' : 'Alert'}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalEvents === 0 ? 'All systems operational' : `${criticalEvents} critical alerts`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${criticalEvents > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${criticalEvents > 0 ? 'text-red-600' : 'text-amber-600'}`}>
              {criticalEvents > 0 ? 'High' : 'Low'}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalEvents > 0 ? 'Immediate attention required' : 'No active threats detected'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Total events monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {systemHealth ? formatUptime(systemHealth.uptime) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current session uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest security events and alerts from system monitoring
              </p>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentEvents.length > 0 ? (
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded ${
                          event.severity === 'critical' ? 'bg-red-100' :
                          event.severity === 'high' ? 'bg-orange-100' :
                          event.severity === 'medium' ? 'bg-amber-100' :
                          'bg-green-100'
                        }`}>
                          {event.severity === 'critical' ? 
                            <AlertTriangle className="h-4 w-4 text-red-600" /> :
                            <Shield className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{event.type}</div>
                          <div className="text-sm text-muted-foreground">
                            Source: {event.source} • {new Date(event.createdAt).toLocaleString()}
                          </div>
                          {event.metadata && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(event.metadata, null, 2).slice(0, 100)}...
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600">All Clear</h3>
                  <p className="text-muted-foreground">No security events detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time system performance and health metrics
              </p>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : systemHealth ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {systemHealth.status}
                      </div>
                      <p className="text-sm text-muted-foreground">System Status</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatUptime(systemHealth.uptime)}
                      </div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatMemory(systemHealth.memory.heapUsed)}
                      </div>
                      <p className="text-sm text-muted-foreground">Memory Used</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Memory Usage</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Heap Used</span>
                        <span>{formatMemory(systemHealth.memory.heapUsed)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Heap Total</span>
                        <span>{formatMemory(systemHealth.memory.heapTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>RSS</span>
                        <span>{formatMemory(systemHealth.memory.rss)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Health data unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <p className="text-sm text-muted-foreground">
                User permissions and role-based access management
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>Role-Based Access Control</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Admin User Sessions</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>Database Security</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Protected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Security Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">
                Live monitoring of security events and system activity
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Monitoring Active</h3>
                <p className="text-muted-foreground">
                  Security events are being monitored in real-time
                </p>
                <div className="mt-4">
                  <Button onClick={() => { refetchEvents(); refetchHealth(); }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}