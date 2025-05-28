/**
 * PostMessage YouTube Player - Enhanced Method
 * Based on: https://medium.com/@mihauco/youtube-iframe-api-without-youtube-iframe-api-f0ac5fcf7c74
 * Uses PostMessage communication instead of complex YouTube IFrame API
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, ExternalLink, RotateCcw, Shield, CheckCircle } from 'lucide-react';

interface PostMessageYouTubePlayerProps {
  videoId: string;
  consciousnessLevel?: number;
  whaleWisdomRequired?: boolean;
  width?: number;
  height?: number;
  autoplay?: boolean;
}

interface YouTubePlayerState {
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

export const PostMessageYouTubePlayer: React.FC<PostMessageYouTubePlayerProps> = ({
  videoId,
  consciousnessLevel = 1,
  whaleWisdomRequired = false,
  width = 560,
  height = 315,
  autoplay = false
}) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    playerState: 'unstarted',
    currentTime: 0,
    duration: 0,
    videoUrl: '',
    muted: false,
    volume: 50
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load video metadata
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        console.log('🐋 Fetching video data with PostMessage whale wisdom...');
        const response = await fetch(`/api/youtube/video/${videoId}`);
        const result = await response.json();
        if (result.success) {
          setVideoData(result.data);
          console.log('🐋 Video metadata loaded for PostMessage player:', result.data);
        }
        setLoading(false);
      } catch (err) {
        console.warn('Could not fetch video metadata:', err);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // PostMessage listener for YouTube iframe communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure message is from YouTube
      if (event.origin !== 'https://www.youtube.com' && event.origin !== 'https://www.youtube-nocookie.com') {
        return;
      }

      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'video-progress') {
          setPlayerState(prev => ({
            ...prev,
            currentTime: data.info?.currentTime || 0,
            duration: data.info?.duration || 0
          }));
        }
        
        if (data.event === 'onStateChange') {
          const stateMap: Record<number, YouTubePlayerState['playerState']> = {
            [-1]: 'unstarted',
            [0]: 'ended',
            [1]: 'playing',
            [2]: 'paused',
            [3]: 'buffering',
            [5]: 'cued'
          };
          
          const newState = stateMap[data.info] || 'unstarted';
          setPlayerState(prev => ({ ...prev, playerState: newState }));
          
          if (newState === 'playing' || newState === 'paused') {
            setPlayerReady(true);
          }
        }

        if (data.event === 'onReady') {
          setPlayerReady(true);
          console.log('🐋 PostMessage YouTube player ready with whale blessing');
        }

      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Player control functions using PostMessage
  const sendCommand = (command: string, args?: any) => {
    if (iframeRef.current?.contentWindow) {
      const message = {
        event: 'command',
        func: command,
        args: args || []
      };
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  const playVideo = () => {
    console.log('🐋 Playing video with whale wisdom blessing');
    sendCommand('playVideo');
  };

  const pauseVideo = () => {
    console.log('🐋 Pausing video with gentle whale guidance');
    sendCommand('pauseVideo');
  };

  const seekTo = (seconds: number) => {
    sendCommand('seekTo', [seconds, true]);
  };

  const setVolume = (volume: number) => {
    sendCommand('setVolume', [volume]);
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const toggleMute = () => {
    if (playerState.muted) {
      sendCommand('unMute');
    } else {
      sendCommand('mute');
    }
    setPlayerState(prev => ({ ...prev, muted: !prev.muted }));
  };

  const openInNewTab = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const restartVideo = () => {
    seekTo(0);
    playVideo();
  };

  // Validate consciousness requirements
  useEffect(() => {
    if (whaleWisdomRequired && consciousnessLevel < 2) {
      setError('Higher consciousness level required for this content');
      setLoading(false);
      return;
    }
  }, [consciousnessLevel, whaleWisdomRequired]);

  if (error) {
    return (
      <div className="postmessage-player-error bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Cannot Load Video</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="postmessage-player-loading bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading PostMessage whale-blessed content...</span>
      </div>
    );
  }

  // Enhanced iframe URL with PostMessage enablement
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
    <div className="postmessage-youtube-player relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden shadow-lg">
      {/* Consciousness Level Indicator */}
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
        PostMessage Level {consciousnessLevel}
        {whaleWisdomRequired && <span className="ml-1 text-blue-600">🐋</span>}
      </div>

      {/* Video Info Overlay */}
      {videoData && (
        <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-800 truncate">
            {videoData.title}
          </h4>
          <p className="text-xs text-gray-600 mb-1">
            {videoData.channelTitle}
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{videoData.viewCount?.toLocaleString()} views</span>
            <span>{videoData.likeCount?.toLocaleString()} likes</span>
            <span>{videoData.duration}</span>
          </div>
        </div>
      )}

      {/* Main Player Container */}
      <div style={{ width, height }} className="relative">
        <iframe
          ref={iframeRef}
          width={width}
          height={height}
          src={iframeUrl}
          title={videoData?.title || 'YouTube Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {/* Enhanced Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <button
              onClick={playerState.playerState === 'playing' ? pauseVideo : playVideo}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              title={playerState.playerState === 'playing' ? 'Pause' : 'Play'}
              disabled={!playerReady}
            >
              {playerState.playerState === 'playing' ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Restart Button */}
            <button
              onClick={restartVideo}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              title="Restart Video"
              disabled={!playerReady}
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              title={playerState.muted ? 'Unmute' : 'Mute'}
              disabled={!playerReady}
            >
              {playerState.muted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>

            {/* External Link */}
            <button
              onClick={openInNewTab}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Player Status & Stats */}
          <div className="text-white text-xs opacity-90 flex items-center space-x-3">
            <span className="capitalize">{playerState.playerState}</span>
            {playerState.duration > 0 && (
              <span>
                {Math.floor(playerState.currentTime)}s / {Math.floor(playerState.duration)}s
              </span>
            )}
            {videoData && (
              <span>
                {videoData.viewCount?.toLocaleString()} views • {videoData.likeCount?.toLocaleString()} likes
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {playerState.duration > 0 && (
          <div className="mt-2">
            <div className="bg-white/20 rounded-full h-1">
              <div 
                className="bg-red-500 h-1 rounded-full transition-all duration-200"
                style={{ width: `${(playerState.currentTime / playerState.duration) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Whale Wisdom Blessing */}
      {whaleWisdomRequired && (
        <div className="absolute top-12 left-2 z-10 bg-blue-100/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-blue-800">
          🐋 PostMessage Whale Blessed
        </div>
      )}
    </div>
  );
};