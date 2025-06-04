/**
 * Stable Admin Dashboard - Working Implementation
 * 
 * Handles undefined data gracefully with proper error boundaries
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
  TrendingUp,
  RefreshCw
} from 'lucide-react';

// Type definitions for admin stats
interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: any[];
  systemHealth: {
    database: string;
    apiResponse: number;
    memoryUsage: number;
    diskUsage: number;
    lastChecked: string;
  };
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

export function StableAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const queryClient = useQueryClient();

  // Fetch dashboard stats with proper error handling
  const { data: stats, isLoading: statsLoading, error } = useQuery<AdminStats>({
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

  // Safe stats with defaults
  const safeStats: AdminStats = stats || {
    totalUsers: 0,
    totalPosts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentActivity: [],
    systemHealth: {
      database: 'checking...',
      apiResponse: 0,
      memoryUsage: 0,
      diskUsage: 0,
      lastChecked: new Date().toISOString()
    }
  };

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
          <RefreshCw className={`h-4 w-4 ${refreshStats.isPending ? 'animate-spin' : ''}`} />
          {refreshStats.isPending ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard data. Please try refreshing.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : safeStats.totalUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-teal-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Posts</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : safeStats.totalPosts}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">
                {statsLoading ? '...' : safeStats.totalOrders}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${statsLoading ? '...' : safeStats.totalRevenue}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">System Health</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Database</p>
            <p className="text-lg font-semibold text-green-600">
              {statsLoading ? '...' : safeStats.systemHealth.database}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">API Response (ms)</p>
            <p className="text-lg font-semibold text-blue-600">
              {statsLoading ? '...' : safeStats.systemHealth.apiResponse}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Memory Usage (%)</p>
            <p className="text-lg font-semibold text-orange-600">
              {statsLoading ? '...' : safeStats.systemHealth.memoryUsage}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Disk Usage (%)</p>
            <p className="text-lg font-semibold text-purple-600">
              {statsLoading ? '...' : safeStats.systemHealth.diskUsage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      default:
        return (
          <div className="text-center py-12">
            <div className="text-purple-600 mb-4">
              <Settings className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">
              {tabConfig.find(tab => tab.id === activeTab)?.label} Coming Soon
            </h3>
            <p className="text-gray-600">
              This section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex flex-wrap gap-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}