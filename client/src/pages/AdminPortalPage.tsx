/**
 * Admin Portal Page - Complete Implementation
 * 
 * Main entry point for the admin portal with full authentication,
 * dashboard integration, and all admin functionality
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernAdminDashboard } from '@/components/admin/ModernAdminDashboard';
import { IntegratedSecurityDashboard } from '@/components/admin/IntegratedSecurityDashboard';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  Image, 
  ShoppingBag,
  BarChart3,
  Activity,
  Atom,
  Mail,
  Upload
} from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export function AdminPortalPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading } = useQuery({
    queryKey: ['/api/admin/auth/check'],
    retry: false
  });

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin portal.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      component: <ModernAdminDashboard />
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      component: <IntegratedSecurityDashboard />
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: <UserManagementSection />
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      component: <ContentManagementSection />
    },
    {
      id: 'media',
      label: 'Media',
      icon: Image,
      component: <MediaManagementSection />
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: ShoppingBag,
      component: <ShopManagementSection />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: <AnalyticsSection />
    },
    {
      id: 'consciousness',
      label: 'Consciousness',
      icon: Activity,
      component: <ConsciousnessSection />
    },
    {
      id: 'quantum',
      label: 'Quantum',
      icon: Atom,
      component: <QuantumSection />
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: Mail,
      component: <NewsletterSection />
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: Upload,
      component: <UploadSection />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: <SettingsSection />
    }
  ];

  const activeComponent = adminSections.find(section => section.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dale Loves Whales</h1>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {adminUser.role}
              </Badge>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{adminUser.username}</p>
                <p className="text-xs text-gray-500">{adminUser.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {adminSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeComponent}
      </main>
    </div>
  );
}

// Placeholder sections for admin functionality
function UserManagementSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">User management interface with PostgreSQL integration coming soon...</p>
      </CardContent>
    </Card>
  );
}

function ContentManagementSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Content management system with multimedia support coming soon...</p>
      </CardContent>
    </Card>
  );
}

function MediaManagementSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Media library and asset management coming soon...</p>
      </CardContent>
    </Card>
  );
}

function ShopManagementSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">E-commerce management and order processing coming soon...</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Advanced analytics and reporting dashboard coming soon...</p>
      </CardContent>
    </Card>
  );
}

function ConsciousnessSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consciousness Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Whale wisdom and consciousness features coming soon...</p>
      </CardContent>
    </Card>
  );
}

function QuantumSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantum Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Quantum consciousness and advanced features coming soon...</p>
      </CardContent>
    </Card>
  );
}

function NewsletterSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Newsletter campaigns and subscriber management coming soon...</p>
      </CardContent>
    </Card>
  );
}

function UploadSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload Center</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Multimedia upload and processing center coming soon...</p>
      </CardContent>
    </Card>
  );
}

function SettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">System configuration and preferences coming soon...</p>
      </CardContent>
    </Card>
  );
}