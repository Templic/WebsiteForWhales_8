import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Users, 
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface WorkflowItem {
  id: string;
  title: string;
  author: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';
  currentStage: string;
  submittedAt: Date;
  assignedReviewer?: string;
  qualityScore: number;
  urgency: 'low' | 'medium' | 'high';
}

interface MediaAsset {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
  variants: string[];
}

export default function ContentWorkflowDashboard() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadWorkflowData();
    loadMediaAssets();
  }, []);

  const loadWorkflowData = async () => {
    // Simulate loading workflow data
    const mockWorkflows: WorkflowItem[] = [
      {
        id: 'wf-1',
        title: 'Whale Migration Patterns 2024',
        author: 'Dale Thompson',
        status: 'pending_review',
        currentStage: 'Editorial Review',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedReviewer: 'Sarah Editor',
        qualityScore: 85,
        urgency: 'medium'
      },
      {
        id: 'wf-2',
        title: 'Ocean Conservation Guidelines',
        author: 'Marine Team',
        status: 'approved',
        currentStage: 'Publication',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        qualityScore: 92,
        urgency: 'high'
      },
      {
        id: 'wf-3',
        title: 'Cosmic Whale Meditation Guide',
        author: 'Consciousness Team',
        status: 'draft',
        currentStage: 'Content Creation',
        submittedAt: new Date(),
        qualityScore: 73,
        urgency: 'low'
      }
    ];
    setWorkflows(mockWorkflows);
  };

  const loadMediaAssets = async () => {
    const mockAssets: MediaAsset[] = [
      {
        id: 'asset-1',
        filename: 'whale-song-visualization.jpg',
        type: 'image/jpeg',
        size: 2457600,
        uploadedAt: new Date(),
        status: 'ready',
        variants: ['thumbnail', 'medium', 'large']
      },
      {
        id: 'asset-2',
        filename: 'ocean-meditation.mp3',
        type: 'audio/mpeg',
        size: 8945120,
        uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'processing',
        variants: []
      }
    ];
    setMediaAssets(mockAssets);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending_review': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const workflowStats = {
    total: workflows.length,
    pending: workflows.filter(w => w.status === 'pending_review').length,
    approved: workflows.filter(w => w.status === 'approved').length,
    overdue: workflows.filter(w => {
      const daysSinceSubmission = (Date.now() - w.submittedAt.getTime()) / (1000 * 60 * 60 * 24);
      return w.status === 'pending_review' && daysSinceSubmission > 2;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Workflow Dashboard</h1>
          <p className="text-gray-600">Manage content approval processes and media assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{workflowStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{workflowStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{workflowStats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{workflowStats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="media">Media Assets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.slice(0, 3).map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <p className="font-medium">{workflow.title}</p>
                          <p className="text-sm text-gray-600">by {workflow.author}</p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(workflow.status)}>
                        {workflow.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Media Processing */}
            <Card>
              <CardHeader>
                <CardTitle>Media Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mediaAssets.map(asset => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{asset.filename}</p>
                        <p className="text-sm text-gray-600">
                          {(asset.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Badge className={
                        asset.status === 'ready' ? 'bg-green-100 text-green-800' :
                        asset.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {asset.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Workflows Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Author</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Stage</th>
                      <th className="text-left p-4">Quality Score</th>
                      <th className="text-left p-4">Submitted</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkflows.map(workflow => (
                      <tr key={workflow.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(workflow.status)}
                            <span className="font-medium">{workflow.title}</span>
                          </div>
                        </td>
                        <td className="p-4">{workflow.author}</td>
                        <td className="p-4">
                          <Badge className={getStatusBadge(workflow.status)}>
                            {workflow.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">{workflow.currentStage}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${workflow.qualityScore}%` }}
                              />
                            </div>
                            <span className="text-sm">{workflow.qualityScore}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {workflow.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Asset Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Media Assets</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here or click to browse
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  Average Processing Time: 2.3 days
                </div>
                <div className="text-lg text-green-600 mb-4">
                  95% approval rate this month
                </div>
                <p className="text-gray-600">
                  Content quality and workflow efficiency metrics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}