/**
 * Modern Admin Dashboard - Simplified Implementation
 * 
 * Functional cosmic-themed admin portal with PostgreSQL integration
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  Image,
  Mail,
  ShoppingBag,
  BarChart3,
  Shield,
  Activity,
  Atom,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Lock,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: ActivityItem[];
  systemHealth: SystemHealth;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  apiResponse: number;
  memoryUsage: number;
  diskUsage: number;
  lastChecked: string;
}

const tabConfig = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content-manager', label: 'Content Manager', icon: Upload },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'consciousness', label: 'Consciousness', icon: Activity },
  { id: 'quantum', label: 'Quantum', icon: Atom },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export function ModernAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  const refreshStats = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    }
  });

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-purple-900">
          Dale Loves Whales - Admin Dashboard
        </h2>
        <button
          onClick={() => refreshStats.mutate()}
          disabled={refreshStats.isPending}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          {refreshStats.isPending ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : (stats.totalUsers || 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-teal-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Blog Posts</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : (stats.totalPosts || 0)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Orders</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : (stats.totalOrders || 0)}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Revenue</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : `$${(stats.totalRevenue || 0).toLocaleString()}`}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {stats.recentActivity?.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">{activity.description}</p>
                  <p className="text-xs text-purple-600">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-purple-600 text-sm">No recent activity</p>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          System Health
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${
              stats.systemHealth?.database === 'healthy' ? 'bg-green-500' :
              stats.systemHealth?.database === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm font-medium text-purple-900">Database</p>
            <p className="text-xs text-purple-600 capitalize">
              {stats.systemHealth?.database || 'Unknown'}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-lg font-bold text-purple-900">
              {stats.systemHealth?.apiResponse || 0}ms
            </p>
            <p className="text-sm font-medium text-purple-900">API Response</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-lg font-bold text-purple-900">
              {stats.systemHealth?.memoryUsage || 0}%
            </p>
            <p className="text-sm font-medium text-purple-900">Memory Usage</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-lg font-bold text-purple-900">
              {stats.systemHealth?.diskUsage || 0}%
            </p>
            <p className="text-sm font-medium text-purple-900">Disk Usage</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Users className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-purple-900">Manage Users</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <FileText className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-purple-900">Create Content</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Image className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-purple-900">Upload Media</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-medium text-purple-900">Security Center</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      
      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-900 mb-4">User Management</h2>
            <p className="text-purple-600">User management features coming soon...</p>
          </div>
        );
      
      case 'content':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Content Management</h2>
            <p className="text-purple-600">Content management features coming soon...</p>
          </div>
        );
      
      case 'media':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Media Library</h2>
            <p className="text-purple-600">Media management features coming soon...</p>
          </div>
        );
      
      case 'security':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Security Dashboard</h2>
            <p className="text-purple-600">Security monitoring features coming soon...</p>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-900 mb-4">{activeTab}</h2>
            <p className="text-purple-600">This section is under development...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Atom className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-900">Dale Loves Whales</h1>
                <p className="text-sm text-purple-600">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Admin
              </div>
              <button
                onClick={() => window.location.href = '/api/logout'}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-purple-500 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default ModernAdminDashboard;