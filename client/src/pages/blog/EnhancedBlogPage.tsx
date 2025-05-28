import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Calendar, 
  ArrowUpRight, 
  Edit, 
  Sparkles,
  Code,
  Zap,
  Brain,
  Wrench,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  category: string;
  published: boolean;
  approved: boolean;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export default function EnhancedBlogPage() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch posts from database
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Extract categories from posts
  const categories = useMemo(() => {
    if (!posts) return [];
    const categorySet = new Set(posts.map(post => post.category));
    return Array.from(categorySet);
  }, [posts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    return posts.filter(post => {
      // For non-admin users, only show published and approved posts
      if (!isAdmin && (!post.published || !post.approved)) {
        return false;
      }
      
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory, isAdmin]);

  // Format post date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Navigate to post
  const navigateToPost = (slug: string) => {
    setLocation(`/blog/${slug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-6 text-white">Dale's Cosmic Blog</h1>
          <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg p-6 max-w-md mx-auto">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <p>Error loading blog posts. The cosmic servers are temporarily offline.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Development Notice Banner */}
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-300">Consciousness Blog Enhancement in Progress</h2>
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          
          <p className="text-center text-gray-300 mb-6">
            Dale's cosmic blog is being upgraded with AI-powered whale wisdom and consciousness integration. 
            The existing posts below showcase the journey while new features are being channeled through advanced algorithms.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Code className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-cyan-400 font-medium">AI Content Enhancement</div>
              <div className="text-gray-400 text-xs">Quantum consciousness patterns</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Zap className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-purple-400 font-medium">Sacred Geometry Posts</div>
              <div className="text-gray-400 text-xs">Visual cosmic storytelling</div>
            </div>
            <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <Brain className="w-5 h-5 text-pink-400 mx-auto mb-2" />
              <div className="text-pink-400 font-medium">Whale Wisdom Integration</div>
              <div className="text-gray-400 text-xs">Deep ocean consciousness</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Wrench className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-blue-400 font-medium">Reality Manifestation</div>
              <div className="text-gray-400 text-xs">Consciousness expansion</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400 font-medium mb-2">
              <Info className="w-4 h-4" />
              Current Status
            </div>
            <div className="text-sm text-gray-300">
              ✨ Database posts are live and fully functional<br/>
              🎨 Enhanced cosmic theming active<br/>
              🔮 AI consciousness features in development<br/>
              🐋 Whale wisdom algorithms being calibrated
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-cyan-300 mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Dale's Cosmic Blog
            </h1>
            <p className="text-purple-200">Journey through consciousness, whale wisdom, and cosmic insights</p>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setLocation('/admin/posts/new')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            >
              <Edit size={16} />
              New Cosmic Post
            </Button>
          )}
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
            <Input
              type="text"
              placeholder="Search cosmic wisdom..."
              className="pl-10 bg-black/40 border-purple-500/30 text-purple-100 placeholder-purple-300/50"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="w-full md:flex-1"
            onValueChange={(value) => handleCategorySelect(value === 'all' ? null : value)}
          >
            <TabsList className="bg-black/40 border-purple-500/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-purple-600"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-black/40 border-purple-500/20 overflow-hidden">
                <div className="aspect-video bg-purple-900/20">
                  <Skeleton className="h-full w-full bg-purple-500/20" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2 bg-purple-500/20" />
                  <Skeleton className="h-4 w-1/2 bg-purple-500/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2 bg-purple-500/20" />
                  <Skeleton className="h-4 w-full mb-2 bg-purple-500/20" />
                  <Skeleton className="h-4 w-3/4 bg-purple-500/20" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-28 bg-purple-500/20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/20">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-purple-200 mb-2">No cosmic insights found</h3>
                <p className="text-purple-300/70">
                  {searchTerm ? 'Try different cosmic search terms or explore all categories' : 'New consciousness posts will manifest here soon'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <Card 
                    key={post.id} 
                    className="bg-black/40 backdrop-blur-xl border-purple-500/20 overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group hover:border-cyan-500/40"
                  >
                    <div 
                      className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 relative group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all duration-300" 
                      style={{ 
                        backgroundImage: post.cover_image ? `url(${post.cover_image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Category Badge */}
                      <Badge className="absolute top-3 left-3 bg-purple-600/90 hover:bg-purple-500 text-white border-0">
                        {post.category}
                      </Badge>
                      
                      {/* Admin Status Badges */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {!post.published && (
                            <Badge variant="outline" className="bg-yellow-500/90 hover:bg-yellow-500 border-0 text-white">
                              Draft
                            </Badge>
                          )}
                          {post.published && !post.approved && (
                            <Badge variant="outline" className="bg-orange-500/90 hover:bg-orange-500 border-0 text-white">
                              Pending
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Cosmic overlay effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <CardHeader>
                      <CardTitle 
                        className="line-clamp-2 text-cyan-300 hover:text-cyan-200 cursor-pointer transition-colors group-hover:text-cyan-100"
                        onClick={() => navigateToPost(post.slug)}
                      >
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-purple-300">
                        <Calendar size={14} />
                        {formatDate(post.created_at)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <p className="text-purple-100/80 line-clamp-3 text-sm">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center">
                      <Button 
                        variant="default" 
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0"
                        onClick={() => navigateToPost(post.slug)}
                      >
                        Read Cosmic Wisdom
                        <ArrowUpRight size={14} />
                      </Button>
                      
                      {/* Admin Quick Actions */}
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-purple-400/30 text-purple-300 hover:bg-purple-500/20"
                          onClick={() => setLocation(`/admin/posts/edit/${post.id}`)}
                        >
                          Edit
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer with cosmic theming */}
        {filteredPosts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-purple-300/70 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>More cosmic consciousness posts coming soon</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}