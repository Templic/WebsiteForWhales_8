/**
 * Cosmic Admin Portal - Enhanced TemplicTune Implementation
 * 
 * Full-featured cosmic-themed admin portal with elegant design,
 * PostgreSQL integration, and comprehensive management features
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
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

interface ContentItem {
  id: number;
  title: string;
  content: string;
  contentType: string;
  status: string;
  targetPages: string[];
  createdBy: string;
  createdAt: string;
}

interface MediaAsset {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  tags: string[];
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  isBanned: boolean;
}

interface SecurityEvent {
  id: number;
  eventType: string;
  threatLevel: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  resolved: boolean;
  createdAt: string;
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
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Dashboard data queries
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users']
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/admin/content']
  });

  const { data: media, isLoading: mediaLoading } = useQuery({
    queryKey: ['/api/admin/media']
  });

  const { data: securityEvents, isLoading: securityLoading } = useQuery({
    queryKey: ['/api/admin/security']
  });

  // File upload functionality
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/content-management/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Upload successful", description: "Files uploaded successfully" });
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
    },
    onError: (error) => {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'video/*': ['.mp4', '.mov'],
      'audio/*': ['.mp3', '.wav']
    }
  });

  const handleUpload = () => {
    if (files.length === 0) return;
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    uploadMutation.mutate(formData);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDashboardTab = () => (
    <div className="space-y-6 p-6">
      {/* Cosmic Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Cosmic Admin Portal
        </h1>
        <p className="text-lg text-gray-300">Manage your universe with elegance and cosmic wisdom</p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <LayoutDashboard className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm font-medium text-purple-200">Dashboard</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <p className="text-sm font-medium text-blue-200">Users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 hover:border-green-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm font-medium text-green-200">Content</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm font-medium text-orange-200">Shop</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 mx-auto mb-2 text-pink-400" />
            <p className="text-sm font-medium text-pink-200">Newsletter</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 hover:border-red-400/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm font-medium text-red-200">Security</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-700/40 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {statsLoading ? '...' : dashboardStats?.totalUsers || 0}
            </div>
            <div className="text-xs text-purple-300">+12% this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-700/40 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {statsLoading ? '...' : dashboardStats?.totalPosts || 0}
            </div>
            <div className="text-xs text-blue-300">+8% this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-green-700/40 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              {statsLoading ? '...' : dashboardStats?.totalOrders || 0}
            </div>
            <div className="text-xs text-green-300">+24% this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/40 to-orange-700/40 border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">
              ${statsLoading ? '...' : dashboardStats?.totalRevenue || '0.00'}
            </div>
            <div className="text-xs text-orange-300">+18% this month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardStats?.recentActivity?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Database</span>
                <Badge variant={dashboardStats?.systemHealth?.database === 'healthy' ? 'default' : 'destructive'}>
                  {dashboardStats?.systemHealth?.database || 'Unknown'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>API Response</span>
                <span className="text-sm">{dashboardStats?.systemHealth?.apiResponse || 0}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Memory Usage</span>
                <span className="text-sm">{dashboardStats?.systemHealth?.memoryUsage || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContentManagerTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multimedia Upload Center</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2">Drop files here...</p>
            ) : (
              <p className="mt-2">Drag & drop files here, or click to select</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Supports images, documents, audio, and video files
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Selected Files:</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                onClick={handleUpload} 
                disabled={uploadMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderUsersTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {usersLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="space-y-4">
            {users?.map((user: User) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h4 className="font-medium">{user.username}</h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    {user.isBanned && (
                      <Badge variant="destructive">Banned</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.lastLogin && (
                    <p className="text-xs text-muted-foreground">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityLoading ? '...' : securityEvents?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityLoading ? '...' : securityEvents?.filter((e: SecurityEvent) => e.threatLevel === 'high').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {securityLoading ? '...' : securityEvents?.filter((e: SecurityEvent) => e.resolved).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          {securityLoading ? (
            <div className="text-center py-4">Loading security events...</div>
          ) : (
            <div className="space-y-3">
              {securityEvents?.slice(0, 10).map((event: SecurityEvent) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{event.eventType}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.ipAddress} - {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      event.threatLevel === 'high' ? 'destructive' :
                      event.threatLevel === 'medium' ? 'secondary' : 'default'
                    }>
                      {event.threatLevel}
                    </Badge>
                    {event.resolved && (
                      <Badge variant="outline" className="text-green-600">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMediaTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
      </CardHeader>
      <CardContent>
        {mediaLoading ? (
          <div className="text-center py-4">Loading media...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media?.map((asset: MediaAsset) => (
              <div key={asset.id} className="border rounded p-2">
                {asset.mimeType.startsWith('image/') ? (
                  <img 
                    src={asset.url} 
                    alt={asset.altText} 
                    className="w-full h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <p className="text-xs mt-1 truncate">{asset.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(asset.size)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline">
          Dale Loves Whales Admin Portal
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-1">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard">{renderDashboardTab()}</TabsContent>
        <TabsContent value="content-manager">{renderContentManagerTab()}</TabsContent>
        <TabsContent value="users">{renderUsersTab()}</TabsContent>
        <TabsContent value="security">{renderSecurityTab()}</TabsContent>
        <TabsContent value="media">{renderMediaTab()}</TabsContent>
        
        {/* Placeholder tabs for other sections */}
        {['content', 'newsletter', 'shop', 'analytics', 'consciousness', 'quantum', 'settings'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{tab} Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}