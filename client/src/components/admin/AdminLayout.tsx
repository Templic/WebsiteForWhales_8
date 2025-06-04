/**
 * Admin Layout Component
 * Provides fixed header layout for admin portal with cosmic theming
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Shield, 
  Home, 
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
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const adminNavItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/content', icon: FileText, label: 'Content' },
    { path: '/admin/media', icon: Music, label: 'Media' },
    { path: '/admin/shop', icon: ShoppingCart, label: 'Shop' },
    { path: '/admin/security', icon: Shield, label: 'Security' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/database', icon: Database, label: 'Database' },
    { path: '/admin/notifications', icon: Bell, label: 'Alerts' },
    { path: '/admin/performance', icon: Activity, label: 'Performance' },
    { path: '/admin/logs', icon: Activity, label: 'Logs' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-600/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-medium">← Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-purple-600/50"></div>
            <h1 className="text-xl font-bold text-white">Dale Loves Whales Admin Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Security Active</span>
            </div>
            <button 
              onClick={() => window.location.href = '/api/logout'}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {adminNavItems.map((item) => {
              const isActive = location === item.path || 
                             (item.path !== '/admin' && location.startsWith(item.path));
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-800/30 text-purple-200 hover:bg-purple-700/50 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content with Top Padding for Fixed Header */}
      <main className="pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}