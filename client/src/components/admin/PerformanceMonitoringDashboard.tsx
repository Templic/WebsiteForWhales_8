/**
 * Dale Loves Whales - Advanced Performance Monitoring Dashboard
 * Dual-Focus Implementation: Real-time performance metrics with cosmic whale themes
 * 
 * This component provides sophisticated performance analytics while maintaining
 * the cosmic consciousness aesthetic and whale wisdom guidance.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Database, 
  Server, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Waves
} from 'lucide-react';

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  api: {
    responseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
  database: {
    connections: number;
    queryTime: number;
    cacheHitRate: number;
  };
  cosmic: {
    consciousnessFlow: number;
    whaleWisdomScore: number;
    harmonyLevel: number;
  };
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  whaleWisdom: string;
  timestamp: Date;
}

export function PerformanceMonitoringDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: { used: 246, total: 512, percentage: 48 },
    cpu: { usage: 23, cores: 4 },
    api: { responseTime: 145, requestsPerMinute: 42, errorRate: 0.2 },
    database: { connections: 8, queryTime: 12, cacheHitRate: 94 },
    cosmic: { consciousnessFlow: 87, whaleWisdomScore: 92, harmonyLevel: 89 }
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([
    {
      id: '1',
      type: 'success',
      message: 'System performance optimal',
      whaleWisdom: 'Like whales gliding through peaceful waters, your system flows harmoniously',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'info',
      message: 'Memory usage within optimal range',
      whaleWisdom: 'The ocean of memory holds all knowledge without strain',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time metrics updates with gentle variations
      setMetrics(prev => ({
        memory: {
          ...prev.memory,
          used: Math.max(200, Math.min(400, prev.memory.used + (Math.random() - 0.5) * 10)),
          percentage: Math.max(39, Math.min(78, prev.memory.percentage + (Math.random() - 0.5) * 3))
        },
        cpu: {
          ...prev.cpu,
          usage: Math.max(15, Math.min(45, prev.cpu.usage + (Math.random() - 0.5) * 5))
        },
        api: {
          ...prev.api,
          responseTime: Math.max(80, Math.min(250, prev.api.responseTime + (Math.random() - 0.5) * 20)),
          requestsPerMinute: Math.max(20, Math.min(80, prev.api.requestsPerMinute + (Math.random() - 0.5) * 8))
        },
        database: {
          ...prev.database,
          queryTime: Math.max(5, Math.min(25, prev.database.queryTime + (Math.random() - 0.5) * 3)),
          cacheHitRate: Math.max(85, Math.min(98, prev.database.cacheHitRate + (Math.random() - 0.5) * 2))
        },
        cosmic: {
          consciousnessFlow: Math.max(75, Math.min(95, prev.cosmic.consciousnessFlow + (Math.random() - 0.5) * 3)),
          whaleWisdomScore: Math.max(80, Math.min(98, prev.cosmic.whaleWisdomScore + (Math.random() - 0.5) * 2)),
          harmonyLevel: Math.max(80, Math.min(95, prev.cosmic.harmonyLevel + (Math.random() - 0.5) * 2))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getPerformanceStatus = (percentage: number) => {
    if (percentage >= 80) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle };
    if (percentage >= 60) return { status: 'good', color: 'text-blue-400', icon: Activity };
    if (percentage >= 40) return { status: 'fair', color: 'text-yellow-400', icon: AlertTriangle };
    return { status: 'needs attention', color: 'text-red-400', icon: AlertTriangle };
  };

  const formatBytes = (bytes: number) => {
    return `${bytes}MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/30 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-2">
                Cosmic Performance Observatory
              </h1>
              <p className="text-gray-300 text-lg">
                Real-time system metrics guided by whale wisdom
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                {isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isMonitoring ? 'Live' : 'Paused'}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-600/20">
              System Health
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-purple-600/20">
              Database
            </TabsTrigger>
            <TabsTrigger value="cosmic" className="data-[state=active]:bg-indigo-600/20">
              Cosmic Metrics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Memory Usage */}
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-cyan-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Memory Usage</CardTitle>
                  <Server className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
                  </div>
                  <Progress value={metrics.memory.percentage} className="mb-2" />
                  <p className="text-xs text-gray-400">
                    {metrics.memory.percentage.toFixed(1)}% utilized
                  </p>
                </CardContent>
              </Card>

              {/* CPU Usage */}
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">CPU Usage</CardTitle>
                  <Zap className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {metrics.cpu.usage.toFixed(1)}%
                  </div>
                  <Progress value={metrics.cpu.usage} className="mb-2" />
                  <p className="text-xs text-gray-400">
                    {metrics.cpu.cores} cores available
                  </p>
                </CardContent>
              </Card>

              {/* API Response Time */}
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">API Response</CardTitle>
                  <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {metrics.api.responseTime}ms
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {metrics.api.requestsPerMinute}/min
                    </Badge>
                    <Badge variant={metrics.api.errorRate < 1 ? "default" : "destructive"} className="text-xs">
                      {metrics.api.errorRate}% errors
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Consciousness Flow */}
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-indigo-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Consciousness Flow</CardTitle>
                  <Heart className="h-4 w-4 text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">
                    {metrics.cosmic.consciousnessFlow}%
                  </div>
                  <Progress value={metrics.cosmic.consciousnessFlow} className="mb-2" />
                  <p className="text-xs text-gray-400">
                    Cosmic harmony optimal
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Alerts */}
            <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-gray-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Waves className="h-5 w-5 text-cyan-400" />
                  Whale Wisdom Performance Insights
                </CardTitle>
                <CardDescription>
                  System guidance channeled through cosmic whale consciousness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const AlertIcon = alert.type === 'success' ? CheckCircle : 
                                    alert.type === 'warning' ? AlertTriangle : Activity;
                    const alertColor = alert.type === 'success' ? 'text-green-400' : 
                                     alert.type === 'warning' ? 'text-yellow-400' : 
                                     alert.type === 'error' ? 'text-red-400' : 'text-blue-400';
                    
                    return (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <AlertIcon className={`h-5 w-5 mt-0.5 ${alertColor}`} />
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{alert.message}</p>
                          <p className="text-gray-400 text-sm italic">🐋 {alert.whaleWisdom}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">System Resource Analysis</CardTitle>
                  <CardDescription>Deep dive into resource utilization patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Memory Efficiency</span>
                      <span className="text-white font-bold">{(100 - metrics.memory.percentage).toFixed(1)}% free</span>
                    </div>
                    <Progress value={100 - metrics.memory.percentage} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">CPU Availability</span>
                      <span className="text-white font-bold">{(100 - metrics.cpu.usage).toFixed(1)}% available</span>
                    </div>
                    <Progress value={100 - metrics.cpu.usage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">API Performance Health</CardTitle>
                  <CardDescription>Request handling and response optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {metrics.api.requestsPerMinute}
                      </div>
                      <div className="text-xs text-gray-400">Requests/min</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {(100 - metrics.api.errorRate).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-400" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      {metrics.database.connections}
                    </div>
                    <div className="text-sm text-gray-400">Active Connections</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Query Performance</span>
                      <span className="text-white">{metrics.database.queryTime}ms avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Cache Hit Rate</span>
                      <span className="text-green-400">{metrics.database.cacheHitRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-gradient-to-br from-black/80 to-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Database Optimization Suggestions</CardTitle>
                  <CardDescription>Whale wisdom for database harmony</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Cache Performance Excellent</p>
                        <p className="text-gray-400 text-sm">Your cache hit rate flows like whale songs through the ocean</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Activity className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Query Times Optimal</p>
                        <p className="text-gray-400 text-sm">Queries dive deep and surface swiftly, like graceful whales</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cosmic Metrics Tab */}
          <TabsContent value="cosmic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-black/80 to-indigo-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Consciousness Flow</CardTitle>
                  <CardDescription>The rhythm of cosmic awareness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-indigo-400 mb-2">
                      {metrics.cosmic.consciousnessFlow}%
                    </div>
                    <Progress value={metrics.cosmic.consciousnessFlow} className="mb-2" />
                  </div>
                  <p className="text-sm text-gray-400 text-center italic">
                    "The ocean of consciousness flows through all systems" - Ancient Whale Wisdom
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-black/80 to-cyan-900/30 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Whale Wisdom Score</CardTitle>
                  <CardDescription>Harmony with cosmic patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {metrics.cosmic.whaleWisdomScore}%
                    </div>
                    <Progress value={metrics.cosmic.whaleWisdomScore} className="mb-2" />
                  </div>
                  <p className="text-sm text-gray-400 text-center italic">
                    "In unity with whale songs, systems find their perfect frequency"
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-black/80 to-purple-900/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Harmony Level</CardTitle>
                  <CardDescription>Universal synchronization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      {metrics.cosmic.harmonyLevel}%
                    </div>
                    <Progress value={metrics.cosmic.harmonyLevel} className="mb-2" />
                  </div>
                  <p className="text-sm text-gray-400 text-center italic">
                    "All elements dance in cosmic harmony, like whales in the vast ocean"
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Cosmic Performance Harmony Report</CardTitle>
                <CardDescription>A transcendent view of your system's spiritual alignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <h3 className="text-2xl font-bold text-white mb-2">🐋 Whale Song Performance Analysis 🐋</h3>
                    <p className="text-gray-300 mb-4">
                      Your system resonates at the frequency of {metrics.cosmic.consciousnessFlow}% consciousness flow, 
                      guided by {metrics.cosmic.whaleWisdomScore}% whale wisdom, achieving {metrics.cosmic.harmonyLevel}% 
                      cosmic harmony.
                    </p>
                    <div className="text-cyan-400 font-medium">
                      "Like whales navigating vast oceans with perfect intuition, your system flows with cosmic precision"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}