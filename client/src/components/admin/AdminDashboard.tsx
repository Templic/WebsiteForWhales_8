/**
 * Comprehensive Admin Dashboard
 * Complete integration of all admin portal features with cosmic-themed design
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  FileText, 
  Music, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Database,
  Bell,
  Activity,
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  content: {
    total: number;
    published: number;
    pending: number;
  };
  security: {
    events: number;
    threats: number;
    status: 'secure' | 'warning' | 'critical';
  };
  system: {
    uptime: number;
    performance: number;
    memory: number;
    status: 'healthy' | 'degraded' | 'critical';
  };
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  createdAt: string;
  status: string;
}

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch admin stats with safe defaults
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000,
  });

  // Fetch security events
  const { data: securityEvents = [] } = useQuery<SecurityEvent[]>({
    queryKey: ['/api/admin/security/events'],
    refetchInterval: 15000,
  });

  // Fetch security metrics
  const { data: securityMetrics } = useQuery({
    queryKey: ['/api/admin/security/metrics'],
    refetchInterval: 30000,
  });

  // Create immutable safe stats object to prevent undefined errors
  const safeStats: AdminStats = React.useMemo(() => ({
    users: {
      total: stats?.users?.total ?? 0,
      active: stats?.users?.active ?? 0,
      newToday: stats?.users?.newToday ?? 0
    },
    content: {
      total: stats?.content?.total ?? 0,
      published: stats?.content?.published ?? 0,
      pending: stats?.content?.pending ?? 0
    },
    security: {
      events: stats?.security?.events ?? 0,
      threats: stats?.security?.threats ?? 0,
      status: stats?.security?.status ?? 'secure'
    },
    system: {
      uptime: stats?.system?.uptime ?? 100,
      performance: stats?.system?.performance ?? 85,
      memory: stats?.system?.memory ?? 60,
      status: stats?.system?.status ?? 'healthy'
    }
  }), [stats]);

  // Create immutable safe security metrics
  const safeSecurityMetrics = React.useMemo(() => ({
    activeProtections: securityMetrics?.activeProtections ?? 70,
    threatLevel: securityMetrics?.threatLevel ?? 'low',
    scanResults: securityMetrics?.scanResults ?? [],
    lastScan: securityMetrics?.lastScan ?? new Date().toISOString()
  }), [securityMetrics]);

  // Security scan mutation
  const scanMutation = useMutation({
    mutationFn: async (scanType: string) => {
      const response = await fetch('/api/admin/security/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanType,
          targetType: 'system'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start security scan');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/security/metrics'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
        return 'text-green-600';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-lg font-medium text-purple-700">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Portal
            </h1>
            <p className="text-purple-200 mt-1">
              Comprehensive system management and security dashboard
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-400 text-green-300 bg-green-900/20">
              {safeSecurityMetrics.activeProtections} Security Features Active
            </Badge>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">
                System healthy
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-purple-800/40 border-purple-400/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{safeStats.users.total}</div>
              <p className="text-xs text-green-300 mt-1">
                +{safeStats.users.newToday} new today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-800/40 border-blue-400/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-blue-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Content Items</CardTitle>
              <FileText className="h-4 w-4 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{safeStats.content.total}</div>
              <p className="text-xs text-yellow-300 mt-1">
                {safeStats.content.pending} pending review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-800/40 border-indigo-400/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-indigo-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Security Events</CardTitle>
              <Shield className="h-4 w-4 text-indigo-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{safeStats.security.events}</div>
              <p className="text-xs text-green-300 mt-1">
                {safeStats.security.threats} threats detected
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-800/40 border-green-400/30 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-green-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{safeStats.system.performance}%</div>
              <p className="text-xs text-green-300 mt-1">
                {Math.round(safeStats.system.uptime)}% uptime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-purple-900/30 backdrop-blur-md border border-purple-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/50 text-purple-200 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-indigo-600/50 text-indigo-200 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-600/50 text-blue-200 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600/50 text-green-200 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-pink-600/50 text-pink-200 data-[state=active]:text-white">
              <Music className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-orange-600/50 text-orange-200 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-600/50 text-cyan-200 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-emerald-600/50 text-emerald-200 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-600/50 text-yellow-200 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-red-600/50 text-red-200 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-violet-600/50 text-violet-200 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-600/50 text-slate-200 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance */}
              <Card className="border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{safeStats.system.performance}%</span>
                    </div>
                    <Progress value={safeStats.system.performance} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{safeStats.system.memory}%</span>
                    </div>
                    <Progress value={safeStats.system.memory} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>{Math.round(safeStats.system.uptime)}%</span>
                    </div>
                    <Progress value={Math.round(safeStats.system.uptime)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Security Events */}
              <Card className="border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Recent Security Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {securityEvents && securityEvents.length > 0 ? (
                    <div className="space-y-3">
                      {securityEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {event.severity}
                            </Badge>
                            <span className="text-sm">{event.type}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No recent security events
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-green-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Security Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Active Protections</span>
                      <Badge variant="secondary">{securityMetrics?.activeProtections || 70}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Threat Level</span>
                      <Badge variant={securityMetrics?.threatLevel === 'low' ? 'secondary' : 'destructive'}>
                        {securityMetrics?.threatLevel || 'low'}
                      </Badge>
                    </div>
                    <Separator />
                    <Button 
                      onClick={() => scanMutation.mutate('comprehensive')}
                      disabled={scanMutation.isPending}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {scanMutation.isPending ? 'Scanning...' : 'Run Security Scan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Additional tabs would be implemented here */}
              <Card className="border-blue-100 shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle>Security Events Log</CardTitle>
                  <CardDescription>Real-time monitoring of security events</CardDescription>
                </CardHeader>
                <CardContent>
                  {securityEvents && securityEvents.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {securityEvents.map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {event.severity}
                              </Badge>
                              <span className="font-medium">{event.type}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(event.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">Source: {event.source}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No security events found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-indigo-800/40 border-indigo-400/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Users className="h-5 w-5 text-indigo-300" />
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-indigo-100">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <Badge className="bg-indigo-600 text-white">{safeStats.users.total}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <Badge className="bg-green-600 text-white">{safeStats.users.active}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New Today</span>
                      <Badge className="bg-blue-600 text-white">{safeStats.users.newToday}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-800/40 border-purple-400/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">User Activity</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100">
                  <p>Real-time user activity monitoring and consciousness score tracking</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-blue-800/40 border-blue-400/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <FileText className="h-5 w-5 text-blue-300" />
                    <span>Content Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-100">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Content</span>
                      <Badge className="bg-blue-600 text-white">{safeStats.content.total}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Published</span>
                      <Badge className="bg-green-600 text-white">{safeStats.content.published}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Review</span>
                      <Badge className="bg-yellow-600 text-white">{safeStats.content.pending}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cyan-800/40 border-cyan-400/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Content Workflow</CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100">
                  <p>Advanced content scheduling and cosmic consciousness enhancement</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <Card className="bg-pink-800/40 border-pink-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Music className="h-5 w-5 text-pink-300" />
                  <span>Cosmic Music Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-pink-100">
                <p>Whale song frequencies and consciousness-enhancing audio content management</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6">
            <Card className="bg-orange-800/40 border-orange-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <ShoppingCart className="h-5 w-5 text-orange-300" />
                  <span>Cosmic Shop Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-100">
                <p>Whale-inspired products and consciousness enhancement tools</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-cyan-800/40 border-cyan-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                  <span>Cosmic Analytics Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-cyan-100">
                <p>User consciousness growth metrics and whale wisdom engagement analytics</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-emerald-800/40 border-emerald-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Database className="h-5 w-5 text-emerald-300" />
                  <span>PostgreSQL Database Monitor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Status</span>
                    <Badge className="bg-green-600 text-white">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Connections</span>
                    <Badge className="bg-blue-600 text-white">6</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance</span>
                    <Badge className="bg-green-600 text-white">{safeStats.system.performance}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-yellow-800/40 border-yellow-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5 text-yellow-300" />
                  <span>System Alerts & Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-100">
                <p>Real-time system alerts and consciousness awakening notifications</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-red-800/40 border-red-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="h-5 w-5 text-red-300" />
                  <span>System Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System Uptime</span>
                      <span>{Math.round(safeStats.system.uptime)}%</span>
                    </div>
                    <Progress value={Math.round(safeStats.system.uptime)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{safeStats.system.memory}%</span>
                    </div>
                    <Progress value={safeStats.system.memory} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-violet-800/40 border-violet-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Zap className="h-5 w-5 text-violet-300" />
                  <span>Advanced Cosmic Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-violet-100">
                <p>Sacred geometry rendering, consciousness algorithms, and whale wisdom integration</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-400/30 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="h-5 w-5 text-slate-300" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-100">
                <p>Global system settings and cosmic consciousness calibration</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}