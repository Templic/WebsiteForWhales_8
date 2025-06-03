import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, ShoppingCart, Music, Shield, BarChart3, Database, Settings } from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalPosts: number;
  totalOrders: number;
  totalRevenue: string;
  recentActivity: Array<{
    id: string;
    description: string;
    timestamp: string;
    type: string;
  }>;
  systemHealth: {
    database: string;
    apiResponse: number;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  profileImageUrl?: string;
}

interface SecurityEvent {
  id: string;
  eventType: string;
  threatLevel: string;
  ipAddress: string;
  resolved: boolean;
  createdAt: string;
}

export default function SimpleAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    retry: false,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false,
  });

  const { data: securityEvents, isLoading: securityLoading } = useQuery({
    queryKey: ['/api/admin/security'],
    retry: false,
  });

  const { data: contentStats, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/admin/content/stats'],
    retry: false,
  });

  const { data: musicStats, isLoading: musicLoading } = useQuery({
    queryKey: ['/api/admin/music/stats'],
    retry: false,
  });

  const { data: shopStats, isLoading: shopLoading } = useQuery({
    queryKey: ['/api/admin/shop/stats'],
    retry: false,
  });

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData?.totalRevenue || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{activity.description}</span>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              )) || <p className="text-muted-foreground">No recent activity</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Database Status</span>
                <Badge variant={dashboardData?.systemHealth?.database === 'healthy' ? 'default' : 'destructive'}>
                  {dashboardData?.systemHealth?.database || 'Unknown'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>API Response Time</span>
                <span className="text-sm text-muted-foreground">
                  {dashboardData?.systemHealth?.apiResponse || 0}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : (
          <div className="space-y-3">
            {users?.map((user: User) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {user.profileImageUrl && (
                    <img src={user.profileImageUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            )) || <p className="text-muted-foreground">No users found</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Events</CardTitle>
        <CardDescription>Monitor security events and threats</CardDescription>
      </CardHeader>
      <CardContent>
        {securityLoading ? (
          <p>Loading security events...</p>
        ) : (
          <div className="space-y-3">
            {securityEvents?.map((event: SecurityEvent) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{event.eventType}</p>
                  <p className="text-sm text-muted-foreground">IP: {event.ipAddress}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={event.threatLevel === 'high' ? 'destructive' : 'default'}>
                    {event.threatLevel}
                  </Badge>
                  {event.resolved && <Badge variant="outline">Resolved</Badge>}
                </div>
              </div>
            )) || <p className="text-muted-foreground">No security events</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderContentTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Published Posts</span>
              <span className="font-medium">{contentStats?.publishedPosts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Draft Posts</span>
              <span className="font-medium">{contentStats?.draftPosts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Comments</span>
              <span className="font-medium">{contentStats?.totalComments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Comments</span>
              <span className="font-medium">{contentStats?.pendingComments || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Music Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Tracks</span>
              <span className="font-medium">{musicStats?.totalTracks || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Published Tracks</span>
              <span className="font-medium">{musicStats?.publishedTracks || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Albums</span>
              <span className="font-medium">{musicStats?.totalAlbums || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShopTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Shop Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Products</span>
              <span className="font-medium">{shopStats?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>In Stock Products</span>
              <span className="font-medium">{shopStats?.inStockProducts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span className="font-medium">{shopStats?.totalOrders || 0}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Recent Orders</h4>
            <div className="space-y-2">
              {shopStats?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <span>Order #{order.id}</span>
                  <span>${order.total}</span>
                </div>
              )) || <p className="text-sm text-muted-foreground">No recent orders</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Dale Loves Whales platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {renderDashboardOverview()}
        </TabsContent>

        <TabsContent value="users">
          {renderUsersTab()}
        </TabsContent>

        <TabsContent value="content">
          {renderContentTab()}
        </TabsContent>

        <TabsContent value="music">
          {renderContentTab()}
        </TabsContent>

        <TabsContent value="shop">
          {renderShopTab()}
        </TabsContent>

        <TabsContent value="security">
          {renderSecurityTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}