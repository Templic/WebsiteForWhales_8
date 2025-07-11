/**
 * AnalyticsDisplay Component
 * 
 * A versatile analytics dashboard component that can display various types of analytics data
 * with support for different time ranges and visualization options.
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle,
  FileText,
  Calendar,
  Clock 
} from 'lucide-react';
import { format } from 'date-fns';

// Types
export type TimeRange = 'today' | 'yesterday' | 'last-7-days' | 'last-30-days' | 'this-month' | 'last-month' | 'custom';

export interface AnalyticsDisplayProps {
  // Time range configuration
  timeRange: TimeRange;
  customRangeStart?: Date;
  customRangeEnd?: Date;
  
  // Display options
  showVisitors?: boolean;
  showConversions?: boolean;
  showRevenue?: boolean;
  
  // Optional callback when time range changes
  onTimeRangeChange?: (range: TimeRange) => void;
}

export function AnalyticsDisplay({ 
  timeRange = 'last-7-days',
  customRangeStart,
  customRangeEnd,
  showVisitors = true,
  showConversions = true,
  showRevenue = true,
  onTimeRangeChange 
}: AnalyticsDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format dates for API calls
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Calculate date range for API based on timeRange
  const getDateRangeForApi = (): { start: string, end: string } => {
    const now = new Date();
    let end = timeRange === 'custom' && customRangeEnd 
      ? formatDateForApi(customRangeEnd)
      : formatDateForApi(now);
      
    let start: string;
    
    switch (timeRange) {
      case 'today':
        start = formatDateForApi(now);
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        start = formatDateForApi(yesterday);
        break;
      case 'last-7-days':
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        start = formatDateForApi(sevenDaysAgo);
        break;
      case 'last-30-days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        start = formatDateForApi(thirtyDaysAgo);
        break;
      case 'this-month':
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        start = formatDateForApi(thisMonthStart);
        break;
      case 'last-month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        start = formatDateForApi(lastMonthStart);
        end = formatDateForApi(lastMonthEnd);
        break;
      case 'custom':
        const defaultStart = new Date(now);
        defaultStart.setDate(defaultStart.getDate() - 7);
        start = customRangeStart ? formatDateForApi(customRangeStart) : formatDateForApi(defaultStart);
        break;
      default:
        const defaultDate = new Date(now);
        defaultDate.setDate(defaultDate.getDate() - 7);
        start = formatDateForApi(defaultDate);
    }
    
    return { start, end };
  };
  
  // Get date range for API calls
  const dateRange = getDateRangeForApi();
  
  // Fetch content analytics data
  const { 
    data: contentAnalytics, 
    isLoading: isLoadingContentAnalytics,
    error: contentAnalyticsError
  } = useQuery({
    queryKey: ['/api/content-workflow/analytics', dateRange.start, dateRange.end],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/content-workflow/analytics?start=${dateRange.start}&end=${dateRange.end}`);
        if (!response.ok) throw new Error('Failed to fetch content analytics');
        return response.json();
      } catch (error) {
        console.error('Error fetching content analytics:', error);
        return null;
      }
    }
  });
  
  // Loading state
  const isLoading = isLoadingContentAnalytics;
  
  // Error state
  const hasError = !!contentAnalyticsError;
  
  return (
    <div className="space-y-6">
      {/* Time Range Tabs */}
      <Tabs defaultValue={timeRange} className="w-full" onValueChange={(value) => onTimeRangeChange?.(value as TimeRange)}>
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
          <TabsTrigger value="last-7-days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="last-30-days">Last 30 Days</TabsTrigger>
          <TabsTrigger value="this-month">This Month</TabsTrigger>
          <TabsTrigger value="last-month">Last Month</TabsTrigger>
          <TabsTrigger value="custom" disabled={!customRangeStart || !customRangeEnd}>Custom</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while fetching analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Content Summary
                </CardTitle>
                <CardDescription>
                  Content management overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Published:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.totalPublished || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">In Review:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.totalInReview || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Drafts:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.totalInDraft || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Approval Rate:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.approvalRate?.toFixed(1) || 0}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Scheduling Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Scheduling Summary
                </CardTitle>
                <CardDescription>
                  Content scheduling metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Upcoming:</span>
                      <span className="font-medium">{contentAnalytics?.scheduling?.upcomingPublications || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expiring Soon:</span>
                      <span className="font-medium">{contentAnalytics?.scheduling?.soonExpiring || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Recent Publishes:</span>
                      <span className="font-medium">{contentAnalytics?.throughput?.last24Hours?.totalPublished || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Recent Archives:</span>
                      <span className="font-medium">{contentAnalytics?.throughput?.last24Hours?.totalArchived || 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Performance Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Processing Times
                </CardTitle>
                <CardDescription>
                  Average processing metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time to Approval:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.avgTimeToApproval?.toFixed(1) || 0} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time to Publish:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.avgTimeToPublish?.toFixed(1) || 0} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rejection Rate:</span>
                      <span className="font-medium">{contentAnalytics?.workflow?.rejectionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">System Health:</span>
                      <span className="font-medium text-green-500">Good</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Charts will be implemented later */}
          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Content creation and publication metrics by time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">Enhanced Chart Visualization</p>
                <p className="text-sm text-muted-foreground">
                  Charts for content analytics will appear here once data is loaded
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Expiring Content List */}
          <Card>
            <CardHeader>
              <CardTitle>Expiring Content</CardTitle>
              <CardDescription>
                Content scheduled to expire soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : contentAnalytics?.expiringContent && contentAnalytics.expiringContent.length > 0 ? (
                <div className="space-y-2">
                  {contentAnalytics.expiringContent.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.section} | {item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-amber-500">Expires: {new Date(item.expirationDate).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">Created by: {item.createdBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No content expiring soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          {/* Workflow Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>
                Key metrics about content approval workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Efficiency Metrics</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg. Time to Approval:</span>
                          <span className="font-medium">{contentAnalytics?.workflow?.avgTimeToApproval?.toFixed(1) || 0} hours</span>
                        </div>
                        <div className="w-full bg-secondary/20 rounded-full h-2">
                          <div 
                            className="bg-secondary h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((contentAnalytics?.workflow?.avgTimeToApproval || 0) / 48) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Target: 48 hours</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg. Time to Publish:</span>
                          <span className="font-medium">{contentAnalytics?.workflow?.avgTimeToPublish?.toFixed(1) || 0} hours</span>
                        </div>
                        <div className="w-full bg-primary/20 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((contentAnalytics?.workflow?.avgTimeToPublish || 0) / 72) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Target: 72 hours</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Approval Metrics</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Approval Rate:</span>
                          <span className="font-medium">{contentAnalytics?.workflow?.approvalRate?.toFixed(1) || 0}%</span>
                        </div>
                        <div className="w-full bg-green-500/20 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${contentAnalytics?.workflow?.approvalRate || 0}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Target: &gt;85%</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rejection Rate:</span>
                          <span className="font-medium">{contentAnalytics?.workflow?.rejectionRate?.toFixed(1) || 0}%</span>
                        </div>
                        <div className="w-full bg-red-500/20 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ 
                              width: `${contentAnalytics?.workflow?.rejectionRate || 0}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Target: &lt;15%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Workflow Status</CardTitle>
              <CardDescription>
                Content items at each stage of the workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary/10 rounded-lg p-4">
                  <h4 className="font-medium mb-1">Draft</h4>
                  <p className="text-3xl font-bold">{contentAnalytics?.workflow?.totalInDraft || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Items pending creation</p>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-medium mb-1">In Review</h4>
                  <p className="text-3xl font-bold">{contentAnalytics?.workflow?.totalInReview || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Items awaiting approval</p>
                </div>
                
                <div className="bg-green-500/10 rounded-lg p-4">
                  <h4 className="font-medium mb-1">Ready to Publish</h4>
                  <p className="text-3xl font-bold">{contentAnalytics?.workflow?.totalApproved || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Approved items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}