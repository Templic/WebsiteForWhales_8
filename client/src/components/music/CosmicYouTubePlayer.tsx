/**
 * Cosmic YouTube Player - Consciousness-Enhanced Video Experience
 * Secure channel communication with whale wisdom integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, ExternalLink, RotateCcw, Shield, CheckCircle, Waves } from 'lucide-react';

interface CosmicYouTubePlayerProps {
  videoId: string;
  consciousnessLevel?: number;
  whaleWisdomRequired?: boolean;
  width?: number;
  height?: number;
  autoplay?: boolean;
}

interface CosmicPlayerState {
  playerState: 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';
  currentTime: number;
  duration: number;
  videoUrl: string;
  muted: boolean;
  volume: number;
  isSecure: boolean;
  connectionStatus: 'connecting' | 'connected' | 'error' | 'disconnected';
  lastHeartbeat: number;
}

export const CosmicYouTubePlayer: React.FC<CosmicYouTubePlayerProps> = ({
  videoId,
  consciousnessLevel = 1,
  whaleWisdomRequired = false,
  width = 560,
  height = 315,
  autoplay = false
}) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [playerState, setPlayerState] = useState<CosmicPlayerState>({
    playerState: 'unstarted',
    currentTime: 0,
    duration: 0,
    videoUrl: '',
    muted: false,
    volume: 50,
    isSecure: true,
    connectionStatus: 'connecting',
    lastHeartbeat: Date.now()
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Enhanced secure message handler
  const handleCosmicMessage = useCallback((event: MessageEvent) => {
    const allowedOrigins = ['https://www.youtube-nocookie.com', 'https://www.youtube.com'];
    
    if (!allowedOrigins.includes(event.origin)) {
      console.warn('Blocked unauthorized cosmic transmission from:', event.origin);
      return;
    }

    try {
      const result = JSON.parse(event.data);
      
      if (result.event === 'onReady') {
        setPlayerReady(true);
        setPlayerState(prev => ({ ...prev, connectionStatus: 'connected', lastHeartbeat: Date.now() }));
      } else if (result.event === 'onStateChange') {
        const stateMap: Record<number, CosmicPlayerState['playerState']> = {
          [-1]: 'unstarted', [0]: 'ended', [1]: 'playing', 
          [2]: 'paused', [3]: 'buffering', [5]: 'cued'
        };
        setPlayerState(prev => ({ 
          ...prev, 
          playerState: stateMap[result.info] || 'unstarted',
          lastHeartbeat: Date.now()
        }));
      } else if (result.event === 'infoDelivery' && result.info) {
        setPlayerState(prev => ({ 
          ...prev, 
          currentTime: result.info.currentTime || prev.currentTime,
          duration: result.info.duration || prev.duration,
          volume: result.info.volume !== undefined ? result.info.volume : prev.volume,
          muted: result.info.muted !== undefined ? result.info.muted : prev.muted,
          lastHeartbeat: Date.now()
        }));
      }
    } catch (error) {
      console.warn('Failed to decode cosmic transmission:', error);
    }
  }, []);

  // Fetch authentic video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/youtube/video/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          setVideoData(data);
        }
      } catch (error) {
        console.warn('Could not retrieve cosmic video data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // Initialize cosmic communication
  useEffect(() => {
    window.addEventListener('message', handleCosmicMessage);
    return () => window.removeEventListener('message', handleCosmicMessage);
  }, [handleCosmicMessage]);

  // Consciousness level validation
  useEffect(() => {
    if (whaleWisdomRequired && consciousnessLevel < 2) {
      setError('Higher consciousness level required for whale wisdom content');
      setLoading(false);
      return;
    }
  }, [consciousnessLevel, whaleWisdomRequired]);

  // Cosmic control functions
  const sendCosmicCommand = useCallback((command: string, args: any[] = []) => {
    if (!playerReady || !iframeRef.current?.contentWindow) return;
    
    const message = JSON.stringify({
      event: 'command',
      func: command,
      args: args
    });
    
    iframeRef.current.contentWindow.postMessage(message, '*');
  }, [playerReady]);

  const playVideo = () => sendCosmicCommand('playVideo');
  const pauseVideo = () => sendCosmicCommand('pauseVideo');
  const restartVideo = () => sendCosmicCommand('seekTo', [0, true]);
  const toggleMute = () => {
    if (playerState.muted) {
      sendCosmicCommand('unMute');
    } else {
      sendCosmicCommand('mute');
    }
  };

  // Format duration helper
  const formatDuration = (duration: string) => {
    if (!duration) return '0:00';
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    const minutes = parseInt(match[1] || '0');
    const seconds = parseInt(match[2] || '0');
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Waves className="w-6 h-6 text-red-400" />
          <h3 className="text-red-200 font-semibold text-lg">Cosmic Frequency Blocked</h3>
        </div>
        <p className="text-red-300/80">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-xl p-8 flex items-center justify-center border border-cyan-500/20 max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-cyan-200">Attuning to cosmic frequencies...</span>
      </div>
    );
  }

  // Enhanced iframe URL with secure communication
  const iframeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?` + new URLSearchParams({
    enablejsapi: '1',
    origin: window.location.origin,
    widgetid: '1',
    autoplay: autoplay ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    fs: '1',
    cc_load_policy: '0',
    iv_load_policy: '3'
  }).toString();

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-xl overflow-hidden shadow-2xl border border-cyan-500/20">
      {/* Cosmic Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-cyan-100 mb-3 font-mono tracking-wide">
              {videoData?.snippet?.title || 'Consciousness Channel Loading...'}
            </h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 rounded-full text-sm font-medium border border-cyan-400/30 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Channel Active
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 rounded-full text-sm font-medium border border-purple-400/30 flex items-center gap-2">
                ⚡ Consciousness Level {consciousnessLevel}
              </span>
              {whaleWisdomRequired && (
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200 rounded-full text-sm font-medium border border-emerald-400/30 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Whale Wisdom Blessed
                </span>
              )}
            </div>
          </div>
          
          {videoData && (
            <div className="text-right text-sm text-cyan-300/80 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 ml-6">
              <div className="flex items-center gap-6 mb-2">
                <span className="flex items-center gap-2">
                  👁️ <span className="text-cyan-200">{parseInt(videoData.statistics?.viewCount || 0).toLocaleString()}</span> <span className="text-cyan-400/60">views</span>
                </span>
                <span className="flex items-center gap-2">
                  👍 <span className="text-cyan-200">{parseInt(videoData.statistics?.likeCount || 0).toLocaleString()}</span> <span className="text-cyan-400/60">likes</span>
                </span>
              </div>
              <div className="text-xs text-cyan-400/70 border-t border-cyan-700/30 pt-2">
                Duration: <span className="text-cyan-200">{formatDuration(videoData.contentDetails?.duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black">
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          width={width}
          height={height}
          className="w-full aspect-video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={videoData?.snippet?.title || 'Cosmic Video Experience'}
        />
        
        {/* Connection Status Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            playerState.connectionStatus === 'connected' 
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' 
              : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              playerState.connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
            } animate-pulse`}></div>
            {playerState.connectionStatus === 'connected' ? 'Channel Open' : 'Connecting...'}
          </div>
        </div>
      </div>

      {/* Cosmic Controls */}
      <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-t border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={playerState.playerState === 'playing' ? pauseVideo : playVideo}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              disabled={!playerReady}
            >
              {playerState.playerState === 'playing' ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            
            <button
              onClick={restartVideo}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 flex items-center justify-center text-purple-200 border border-purple-400/30 transition-all duration-200"
              disabled={!playerReady}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 flex items-center justify-center text-emerald-200 border border-emerald-400/30 transition-all duration-200"
              disabled={!playerReady}
            >
              {playerState.muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-cyan-300/80">
              Status: <span className="text-cyan-200 capitalize">{playerState.playerState}</span>
            </div>
            
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 rounded-lg border border-red-400/30 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Cosmic Space
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicYouTubePlayer;