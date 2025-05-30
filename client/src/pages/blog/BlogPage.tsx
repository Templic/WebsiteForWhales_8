/**
 * BlogPage.tsx
 * 
 * Migrated as part of the repository reorganization.
 */

import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate } from "@/lib/date-utils";
import { SpotlightEffect } from "@/components/SpotlightEffect";
import { ThrottledSacredGeometry } from "@/components/cosmic/ThrottledSacredGeometry";
import { useLocation } from "wouter";

export default function BlogPage() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      return res.json();
    },
    retry: 1,
  });

  const handleLoadMore = () => {
    toast({
      title: "Cosmic Content Expanding",
      description: "More whale wisdom and consciousness posts are being channeled through the universe!",
    });
  };

  return (
    <>
      <SpotlightEffect />
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Development Notice Banner */}
        <div className="cosmic-glass-card p-8 mb-8 border border-cyan-500/30 rounded-xl backdrop-blur-lg bg-gradient-to-r from-black/60 via-purple-900/40 to-black/60">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <SacredGeometry variant="hexagon" size={32} intensity="glow" className="text-cyan-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-cyan-300">🌊 Dale's Cosmic Blog Enhancement in Progress 🐋</h2>
            <SacredGeometry variant="triangle" size={32} intensity="glow" className="text-purple-400 animate-pulse" />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-lg text-gray-300 mb-4">
              ✨ The consciousness blog is being upgraded with AI-powered whale wisdom integration! ✨
            </p>
            <p className="text-gray-400">
              Dale's profound oceanic insights are being channeled through advanced cosmic algorithms to bring you enhanced spiritual content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 text-sm mb-6">
            <div className="text-center p-4 bg-cyan-500/15 rounded-lg border border-cyan-500/30 transform hover:scale-105 transition-all">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-cyan-400 font-medium">AI Whale Wisdom</div>
              <div className="text-gray-400 text-xs">Quantum consciousness patterns</div>
            </div>
            <div className="text-center p-4 bg-purple-500/15 rounded-lg border border-purple-500/30 transform hover:scale-105 transition-all">
              <div className="text-2xl mb-2">🔮</div>
              <div className="text-purple-400 font-medium">Sacred Geometry Posts</div>
              <div className="text-gray-400 text-xs">Cosmic visual storytelling</div>
            </div>
            <div className="text-center p-4 bg-pink-500/15 rounded-lg border border-pink-500/30 transform hover:scale-105 transition-all">
              <div className="text-2xl mb-2">🐋</div>
              <div className="text-pink-400 font-medium">Ocean Consciousness</div>
              <div className="text-gray-400 text-xs">Deep sea wisdom integration</div>
            </div>
            <div className="text-center p-4 bg-blue-500/15 rounded-lg border border-blue-500/30 transform hover:scale-105 transition-all">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-blue-400 font-medium">Reality Manifestation</div>
              <div className="text-gray-400 text-xs">Consciousness expansion tools</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 p-6">
            <div className="flex items-center gap-3 text-yellow-400 font-medium mb-3">
              <span className="text-xl">🚧</span>
              <span>Current Development Status</span>
              <span className="text-xl">🚧</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">✅</span>
                  <span>Database integration active</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">✅</span>
                  <span>Cosmic theming implemented</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✅</span>
                  <span>Sacred geometry visuals ready</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400">🔄</span>
                  <span>AI consciousness features developing</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400">🔄</span>
                  <span>Whale wisdom algorithms calibrating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📝</span>
                  <span>Sample cosmic content being channeled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header with sacred geometry */}
        <div className="relative mb-10">
          <h1 className="text-4xl font-bold text-[#00ebd6] mb-2 text-center">Cosmic Blog</h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-6">
            Explore the journey of cosmic consciousness through Dale's experiences, insights, and adventures
          </p>
          
          {/* Sacred geometry elements - updated to advanced timing system */}
          <div className="absolute -top-14 -right-4 opacity-20 hidden md:block">
            <ThrottledSacredGeometry variant="octagon" size={100} animated={true} intensity="medium" />
          </div>
          <div className="absolute -bottom-10 -left-4 opacity-20 hidden md:block">
            <ThrottledSacredGeometry variant="merkaba" size={80} animated={true} intensity="medium" />
          </div>
        </div>
        
        {/* Blog posts */}
        {isLoading ? (
          <div className="relative">
            {/* Octagon shape container with clip-path */}
            <div className="absolute inset-0 bg-[#00ebd6]/10 backdrop-blur-sm transform transition-all 
                clip-path-octagon border-2 border-[#00ebd6]/30 z-0"></div>
                
            <div className="relative z-10 p-8">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm transform transition-all 
                clip-path-octagon border-2 border-red-500/30 z-0"></div>
                
            <div className="relative z-10 p-8 text-center">
              <p className="text-red-400">Error loading posts. Please try again later.</p>
            </div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post) => (
              <article key={post.id} className="relative group w-full aspect-square max-w-lg mx-auto">
                {/* Improved octagon shape container with clip-path */}
                <div className="absolute inset-0 bg-[#00ebd6]/10 backdrop-blur-sm transform transition-all 
                    clip-path-octagon border-2 border-[#00ebd6]/30 z-0 group-hover:border-[#00ebd6]/60"></div>
                
                {/* Sacred geometry in corner - only visible on hover */}
                <div className="absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <SacredGeometry variant="octagon" size={60} animated={false} />
                </div>
                
                {/* Content container maximizing octagon space */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-10 lg:p-12" style={{
                  margin: '10%'
                }}>
                  {post.featuredImage && (
                    <div className="mb-3 max-h-24 overflow-hidden rounded-lg">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  
                  {/* Title optimized for octagon */}
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#00ebd6] mb-3 text-center leading-tight">
                    {post.title}
                  </h2>
                  
                  {/* Content with octagon-aware spacing */}
                  <div className="text-gray-300 text-xs sm:text-sm flex-grow overflow-hidden text-center mb-4">
                    <div className="line-clamp-3">
                      {typeof post.content === 'string' 
                       ? post.content
                          .replace(/<[^>]*>/g, '')
                          .replace(/\s+/g, ' ')
                          .trim()
                          .substring(0, 120)
                       : ''}...
                    </div>
                  </div>
                  
                  {/* Bottom section centered */}
                  <div className="flex flex-col items-center gap-2 mt-auto">
                    <p className="text-xs text-[#fe0064] text-center">
                      {formatDisplayDate(post.createdAt)}
                    </p>
                    <Button 
                      className="text-xs bg-transparent border border-[#00ebd6] text-[#00ebd6] hover:bg-[#00ebd6]/10 hover:shadow-[0_0_10px_rgba(0,235,214,0.4)] px-3 py-1.5"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-[#00ebd6]/10 backdrop-blur-sm transform transition-all 
                clip-path-octagon border-2 border-[#00ebd6]/30 z-0"></div>
                
            <div className="relative z-10 p-16 text-center">
              <SacredGeometry variant="octagon" size={100} animated={false} className="mx-auto opacity-30 mb-6" />
              <p className="text-xl text-gray-300">No posts found. Check back soon for cosmic insights!</p>
            </div>
          </div>
        )}

        {posts && posts.length > 0 && (
          <footer className="flex justify-center mt-12">
            <Button
              className="bg-[#00ebd6] text-black px-8 py-3 rounded-full transition-all duration-300 hover:bg-[#fe0064] hover:text-white hover:translate-y-[-2px] hover:shadow-[0_0_15px_rgba(254,0,100,0.7)]"
              onClick={handleLoadMore}
            >
              Load More Posts
            </Button>
          </footer>
        )}
      </div>
    </>
  );
}
