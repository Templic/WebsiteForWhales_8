/**
 * Simple Admin Portal - Direct Access for Testing
 * Content creation system that connects to blog with authentic database operations
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalProducts: number;
  totalOrders: number;
  totalNewsletters: number;
  totalSubscribers: number;
  totalContentItems: number;
  systemHealth: string;
  timestamp: string;
}

export default function SimpleAdminPortal() {
  const [loading, setLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState('');

  const { data: stats, isLoading, refetch } = useQuery<AdminStats>({
    queryKey: ['/api/admin/comprehensive-stats'],
    refetchInterval: 30000,
  });

  // Function to create sample blog post
  async function createSampleBlogPost() {
    setLoading(true);
    setCreateMessage('');
    
    try {
      const response = await fetch('/api/admin/create-sample-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Whale Wisdom: Consciousness Expansion through Oceanic Connection',
          authorId: '1'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCreateMessage('✓ Whale wisdom blog post created and published successfully! Check the blog page to see your new content.');
        refetch();
      } else {
        setCreateMessage('Failed to create blog post: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating sample post:', error);
      setCreateMessage('Error creating blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dale Loves Whales - Admin Portal
          </h1>
          <p className="text-purple-200">
            Content Management & Database Operations
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Users</h3>
            <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Posts</h3>
            <div className="text-3xl font-bold text-white">{stats?.totalPosts || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Comments</h3>
            <div className="text-3xl font-bold text-white">{stats?.totalComments || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Products</h3>
            <div className="text-3xl font-bold text-white">{stats?.totalProducts || 0}</div>
          </div>
        </div>

        {/* Content Creation Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Content Creation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-200 mb-3">
                Blog Post Creation
              </h3>
              <p className="text-white/80 mb-4">
                Create whale wisdom content that connects directly to the blog page with authentic database operations.
              </p>
              <button
                onClick={createSampleBlogPost}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Creating Post...' : 'Create Whale Wisdom Post'}
              </button>
              
              {createMessage && (
                <div className={`mt-4 p-4 rounded-lg ${
                  createMessage.includes('✓') 
                    ? 'bg-green-500/20 border border-green-500/40 text-green-200'
                    : 'bg-red-500/20 border border-red-500/40 text-red-200'
                }`}>
                  {createMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Blog
            </a>
            <a 
              href="/" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Home Page
            </a>
            <a 
              href="/admin" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Full Admin
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center mt-8">
          <p className="text-white/60 text-sm">
            System Status: {stats?.systemHealth || 'Unknown'} • 
            Database Connected • 
            Last Updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}