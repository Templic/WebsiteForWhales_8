/**
 * SpatialAudioExperience.tsx
 * 
 * Component Type: feature
 * Migrated as part of the repository reorganization.
 * Enhanced with fullscreen, head tracking, and headphone optimization features.
 */
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  MapPin, 
  Compass, 
  ScanEye, 
  Maximize, 
  Minimize, 
  Headphones,
  Settings,
  Info 
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface SpatialAudioExperienceProps {
  audioUrls?: { name: string; url: string }[]
  className?: string
}

export function SpatialAudioExperience({
  audioUrls = [
    { name: 'Cosmic Ambient', url: '/audio/meditation-alpha.mp3' },
    { name: 'Forest Sounds', url: '/audio/theta-waves.mp3' },
    { name: 'Ocean Waves', url: '/audio/delta-waves.mp3' },
    { name: 'Crystal Bowls', url: '/audio/alpha-focus.mp3' },
  ],
  className
}: SpatialAudioExperienceProps) {
  // Audio elements and context
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const pannerNodeRef = useRef<PannerNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Canvas for visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number>(0)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showVisualization, setShowVisualization] = useState(true)

  // 3D position state (x, y, z)
  const [position, setPosition] = useState<[number, number, number]>([0, 0, -1])

  // Environment settings
  const [roomSize, setRoomSize] = useState(0.8) // 0-1 scale
  const [reflection, setReflection] = useState(0.5) // 0-1 scale
  
  // Fullscreen and new feature states
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [headTracking, setHeadTracking] = useState(false)
  const [showHeadphoneWarning, setShowHeadphoneWarning] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Initialize audio context and nodes
  const initializeAudio = () => {
    if (isInitialized) return

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Set up audio element
      audioElementRef.current = new Audio(audioUrls[selectedTrack].url)
      audioElementRef.current.loop = true

      // Create nodes
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current)
      pannerNodeRef.current = audioContextRef.current.createPanner()
      gainNodeRef.current = audioContextRef.current.createGain()
      analyserRef.current = audioContextRef.current.createAnalyser()

      // Configure panner
      if (pannerNodeRef.current) {
        pannerNodeRef.current.panningModel = 'HRTF' // Head-related transfer function - more realistic
        pannerNodeRef.current.distanceModel = 'inverse'
        pannerNodeRef.current.refDistance = 1
        pannerNodeRef.current.maxDistance = 10000
        pannerNodeRef.current.rolloffFactor = 1
        pannerNodeRef.current.coneInnerAngle = 360
        pannerNodeRef.current.coneOuterAngle = 360
        pannerNodeRef.current.coneOuterGain = 0

        // Set initial position
        pannerNodeRef.current.setPosition(...position)
      }

      // Configure analyzer
      if (analyserRef.current) {
        analyserRef.current.fftSize = 256
      }

      // Connect nodes: source -> panner -> gain -> analyser -> destination
      sourceNodeRef.current.connect(pannerNodeRef.current!)
      pannerNodeRef.current!.connect(gainNodeRef.current!)
      gainNodeRef.current!.connect(analyserRef.current!)
      analyserRef.current!.connect(audioContextRef.current.destination)

      // Set initial volume
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume / 100
      }

      // Start visualization if enabled
      if (showVisualization) {
        startVisualization()
      }

      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing spatial audio:', error)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause()
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }

      if (pannerNodeRef.current) {
        pannerNodeRef.current.disconnect()
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
      }

      if (analyserRef.current) {
        analyserRef.current.disconnect()
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Handle play/pause
  useEffect(() => {
    if (!isInitialized) return

    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }
      audioElementRef.current?.play().catch(err => {
        console.error('Error playing audio:', err)
        setIsPlaying(false)
      })
    } else {
      audioElementRef.current?.pause()
    }
  }, [isPlaying, isInitialized])

  // Handle volume changes
  useEffect(() => {
    if (!gainNodeRef.current) return

    const volumeValue = isMuted ? 0 : volume / 100
    gainNodeRef.current.gain.value = volumeValue
  }, [volume, isMuted])

  // Handle track changes
  useEffect(() => {
    if (!audioElementRef.current || !isInitialized) return

    const wasPlaying = isPlaying
    if (wasPlaying) {
      audioElementRef.current.pause()
    }

    audioElementRef.current.src = audioUrls[selectedTrack].url
    audioElementRef.current.load()

    if (wasPlaying) {
      audioElementRef.current.play().catch(console.error)
    }
  }, [selectedTrack, audioUrls, isInitialized])

  // Handle position changes
  useEffect(() => {
    if (!pannerNodeRef.current) return
    pannerNodeRef.current.setPosition(...position)
  }, [position])

  // Handle auto-rotation
  useEffect(() => {
    if (!autoRotate || !isInitialized) return

    const rotationInterval = setInterval(() => {
      // Calculate new position based on rotation around the listener
      const radius = Math.sqrt(position[0] * position[0] + position[2] * position[2])
      const angle = Math.atan2(position[2], position[0]) + 0.05 // Small increment for rotation
      
      const newX = radius * Math.cos(angle)
      const newZ = radius * Math.sin(angle)
      
      setPosition([newX, position[1], newZ])
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [autoRotate, position, isInitialized])

  // Handle visualization toggle and update on fullscreen change
  useEffect(() => {
    if (!isInitialized) return
    
    let cleanupFn: (() => void) | undefined

    if (showVisualization) {
      cleanupFn = startVisualization()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    return () => {
      if (cleanupFn) cleanupFn()
    }
  }, [showVisualization, isInitialized, isFullscreen])
  
  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  
  // Setup head tracking
  useEffect(() => {
    if (!headTracking || !isInitialized || !pannerNodeRef.current) return
    
    let lastBeta = 0
    let lastGamma = 0
    
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return
      
      // Get orientation angles (beta: front-to-back tilt, gamma: left-to-right tilt)
      const beta = event.beta  // -180 to 180 (front-to-back)
      const gamma = event.gamma // -90 to 90 (left-to-right)
      
      // Apply smoothing
      const smoothingFactor = 0.2
      const smoothBeta = lastBeta + smoothingFactor * (beta - lastBeta)
      const smoothGamma = lastGamma + smoothingFactor * (gamma - lastGamma)
      
      lastBeta = smoothBeta
      lastGamma = smoothGamma
      
      // Convert orientation to position
      // Normalize angles to a reasonable range for spatial positioning
      const normalizedGamma = (smoothGamma / 45) * 2 // left/right
      const normalizedBeta = ((smoothBeta - 45) / 45) * 2 // up/down (centered around 45 degrees)
      
      // Update position with fixed distance (z value)
      setPosition([normalizedGamma, normalizedBeta, -1])
    }
    
    // Request permission for DeviceOrientation events (for iOS 13+)
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          (DeviceOrientationEvent as any).requestPermission) {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission()
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation)
          } else {
            console.log('Device orientation permission denied')
            setHeadTracking(false)
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error)
          setHeadTracking(false)
        }
      } else {
        // For devices that don't require permission
        window.addEventListener('deviceorientation', handleDeviceOrientation)
      }
    }
    
    requestPermission()
    
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [headTracking, isInitialized, position])

  // Toggle play/pause
  const togglePlay = () => {
    if (!isInitialized) {
      initializeAudio()
    }
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Start visualization
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Make sure canvas dimensions match its display size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    
    resizeCanvas()
    
    // Add resize listener for fullscreen changes
    window.addEventListener('resize', resizeCanvas)
    
    // Clean up listener on visualization stop
    const cleanup = () => {
      window.removeEventListener('resize', resizeCanvas)
    }

    // Adjusted for better visualization
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      
      // Get current center and dimensions - recalculate on each frame to handle resize
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 10
      
      analyserRef.current!.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw listener position (center)
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fill()
      
      // Calculate sound position on 2D plane
      const soundX = centerX + (position[0] * radius / 2)
      const soundZ = centerY - (position[2] * radius / 2) // Invert Z for screen coordinates
      
      // Draw outer ripple circles from sound source
      for (let i = 5; i >= 0; i--) {
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        const rippleRadius = (average / 256) * (i + 1) * 20
        
        ctx.beginPath()
        ctx.arc(soundX, soundZ, rippleRadius, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(138, 43, 226, ${0.7 - i * 0.1})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      // Draw sound source position
      ctx.beginPath()
      ctx.arc(soundX, soundZ, 12, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(138, 43, 226, 0.8)'
      ctx.fill()
      
      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(soundX, soundZ)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    draw()
    
    // Return cleanup function for event handlers
    return cleanup
  }

  // Position control handlers
  const handlePositionChange = (direction: 'left' | 'right' | 'front' | 'back' | 'up' | 'down') => {
    const [x, y, z] = position
    const step = 0.5
    
    switch (direction) {
      case 'left':
        setPosition([x - step, y, z])
        break
      case 'right':
        setPosition([x + step, y, z])
        break
      case 'front':
        setPosition([x, y, z - step])
        break
      case 'back':
        setPosition([x, y, z + step])
        break
      case 'up':
        setPosition([x, y + step, z])
        break
      case 'down':
        setPosition([x, y - step, z])
        break
    }
  }

  // Reset position
  const resetPosition = () => {
    setPosition([0, 0, -1])
  }
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }
  
  // Dismiss headphone warning
  const dismissHeadphoneWarning = () => {
    setShowHeadphoneWarning(false)
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20", 
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-8" : "",
        className
      )}
    >
      {/* Headphone warning alert */}
      {showHeadphoneWarning && (
        <Alert className="mb-4 bg-blue-900/30 border-blue-500/30 text-white">
          <Headphones className="h-4 w-4 text-blue-400" />
          <AlertDescription className="flex justify-between items-center">
            <span>For the best spatial audio experience, please use headphones.</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={dismissHeadphoneWarning}
              className="text-blue-300 hover:text-blue-100 hover:bg-blue-800/30"
            >
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Compass className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Spatial Audio Experience</h3>
            <p className="text-xs text-white/60">3D sound positioning with HRTF technology</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="border-white/10 text-white hover:bg-white/5"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="border-white/10 text-white hover:bg-white/5"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="default"
            onClick={togglePlay}
            className={isPlaying ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <div className={cn(
        "flex flex-col lg:flex-row gap-6",
        isFullscreen ? "h-[calc(100%-120px)]" : ""
      )}>
        {/* Left column - Visualization */}
        <div className={cn("flex-1", isFullscreen ? "flex items-center justify-center" : "")}>
          <div className={cn(
            "relative rounded-lg overflow-hidden bg-black/50 border border-white/10 backdrop-blur-sm",
            isFullscreen ? "w-full h-full max-h-[90vh]" : "aspect-square"
          )}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            ></canvas>
            <div className={cn(
              "absolute bg-black/70 text-white px-2 py-1 rounded-md backdrop-blur-sm",
              isFullscreen ? "text-sm bottom-4 left-4" : "text-xs top-2 left-2"
            )}>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-purple-400" />
                <span>Position: [{position[0].toFixed(1)}, {position[1].toFixed(1)}, {position[2].toFixed(1)}]</span>
              </div>
              {headTracking && (
                <div className="mt-1 text-xs text-purple-300">
                  <span>Head tracking active</span>
                </div>
              )}
            </div>
          </div>

          {/* Position controls */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('left')}
            >
              Left
            </Button>
            <div className="grid grid-rows-2 gap-2">
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
                onClick={() => handlePositionChange('front')}
              >
                Front
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
                onClick={() => handlePositionChange('back')}
              >
                Back
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('right')}
            >
              Right
            </Button>
          </div>

          {/* Up/Down and Reset */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('up')}
            >
              Up
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={resetPosition}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('down')}
            >
              Down
            </Button>
          </div>
        </div>

        {/* Right column - Controls */}
        <div className="flex-1 space-y-6">
          {/* Audio source selection */}
          <div className="space-y-2">
            <Label className="text-white">Audio Source</Label>
            <Select 
              value={selectedTrack.toString()} 
              onValueChange={(value) => setSelectedTrack(parseInt(value))}
            >
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select a sound" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                {audioUrls.map((audio, index) => (
                  <SelectItem key={index} value={index.toString()} className="text-white hover:bg-white/10">
                    {audio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Volume control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Volume</Label>
              <span className="text-sm text-white/80">{volume}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              className="cursor-pointer"
            />
          </div>

          {/* Room size control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Room Size</Label>
              <span className="text-sm text-white/80">{(roomSize * 100).toFixed(0)}%</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[roomSize]}
              onValueChange={(value) => setRoomSize(value[0])}
              className="cursor-pointer"
            />
            <p className="text-xs text-white/60">
              Adjust perceived room size for the spatial audio effect
            </p>
          </div>

          {/* Reflection control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Reflection</Label>
              <span className="text-sm text-white/80">{(reflection * 100).toFixed(0)}%</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[reflection]}
              onValueChange={(value) => setReflection(value[0])}
              className="cursor-pointer"
            />
            <p className="text-xs text-white/60">
              Control the amount of sound reflection in the space
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-white/70" />
                <Label className="text-white cursor-pointer">Auto-rotate sound</Label>
              </div>
              <Switch
                checked={autoRotate}
                onCheckedChange={(value) => {
                  setAutoRotate(value)
                  // Disable head tracking if auto-rotate is enabled
                  if (value && headTracking) {
                    setHeadTracking(false)
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/70" />
                <Label className="text-white cursor-pointer">
                  Head tracking
                  <span className="text-xs ml-1 text-white/60">(mobile only)</span>
                </Label>
              </div>
              <Switch
                checked={headTracking}
                onCheckedChange={(value) => {
                  setHeadTracking(value)
                  // Disable auto-rotate if head tracking is enabled
                  if (value && autoRotate) {
                    setAutoRotate(false)
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanEye className="h-4 w-4 text-white/70" />
                <Label className="text-white cursor-pointer">Show visualization</Label>
              </div>
              <Switch
                checked={showVisualization}
                onCheckedChange={setShowVisualization}
              />
            </div>
          </div>

          {/* Usage tips */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">For best experience:</h4>
            <ul className="text-xs text-white/70 space-y-1 list-disc pl-4">
              <li>Use headphones for true 3D audio effect</li>
              <li>Try different positions to experience the spatial effect</li>
              <li>Enable auto-rotate for an immersive sound journey</li>
              <li>On mobile, enable head tracking for motion-controlled audio</li>
              <li>Use fullscreen mode for a more immersive visualization</li>
              <li>Experiment with different audio sources and room settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Original SpatialAudioExperience component merged from: client/src/components/audio/SpatialAudioExperience.tsx
 * Merge date: 2025-04-05
 */
function SpatialAudioExperienceOriginal({
  audioUrls = [
    { name: 'Cosmic Ambient', url: '/audio/meditation-alpha.mp3' },
    { name: 'Forest Sounds', url: '/audio/theta-waves.mp3' },
    { name: 'Ocean Waves', url: '/audio/delta-waves.mp3' },
    { name: 'Crystal Bowls', url: '/audio/alpha-focus.mp3' },
  ],
  className
}: SpatialAudioExperienceProps) {
  // Audio elements and context
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const pannerNodeRef = useRef<PannerNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Canvas for visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number>(0)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showVisualization, setShowVisualization] = useState(true)

  // 3D position state (x, y, z)
  const [position, setPosition] = useState<[number, number, number]>([0, 0, -1])

  // Environment settings
  const [roomSize, setRoomSize] = useState(0.8) // 0-1 scale
  const [reflection, setReflection] = useState(0.5) // 0-1 scale

  // Initialize audio context and nodes
  const initializeAudio = () => {
    if (isInitialized) return

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Set up audio element
      audioElementRef.current = new Audio(audioUrls[selectedTrack].url)
      audioElementRef.current.loop = true

      // Create nodes
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current)
      pannerNodeRef.current = audioContextRef.current.createPanner()
      gainNodeRef.current = audioContextRef.current.createGain()
      analyserRef.current = audioContextRef.current.createAnalyser()

      // Configure panner
      if (pannerNodeRef.current) {
        pannerNodeRef.current.panningModel = 'HRTF' // Head-related transfer function - more realistic
        pannerNodeRef.current.distanceModel = 'inverse'
        pannerNodeRef.current.refDistance = 1
        pannerNodeRef.current.maxDistance = 10000
        pannerNodeRef.current.rolloffFactor = 1
        pannerNodeRef.current.coneInnerAngle = 360
        pannerNodeRef.current.coneOuterAngle = 360
        pannerNodeRef.current.coneOuterGain = 0

        // Set initial position
        pannerNodeRef.current.setPosition(...position)
      }

      // Configure analyzer
      if (analyserRef.current) {
        analyserRef.current.fftSize = 256
      }

      // Connect nodes: source -> panner -> gain -> analyser -> destination
      sourceNodeRef.current.connect(pannerNodeRef.current!)
      pannerNodeRef.current!.connect(gainNodeRef.current!)
      gainNodeRef.current!.connect(analyserRef.current!)
      analyserRef.current!.connect(audioContextRef.current.destination)

      // Set initial volume
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume / 100
      }

      // Start visualization if enabled
      if (showVisualization) {
        startVisualization()
      }

      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing spatial audio:', error)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause()
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }

      if (pannerNodeRef.current) {
        pannerNodeRef.current.disconnect()
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
      }

      if (analyserRef.current) {
        analyserRef.current.disconnect()
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Handle play/pause
  useEffect(() => {
    if (!isInitialized) return

    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }
      audioElementRef.current?.play().catch(err => {
        console.error('Error playing audio:', err)
        setIsPlaying(false)
      })
    } else {
      audioElementRef.current?.pause()
    }
  }, [isPlaying, isInitialized])

  // Handle volume changes
  useEffect(() => {
    if (!gainNodeRef.current) return

    const volumeValue = isMuted ? 0 : volume / 100
    gainNodeRef.current.gain.value = volumeValue
  }, [volume, isMuted])

  // Handle track changes
  useEffect(() => {
    if (!audioElementRef.current || !isInitialized) return

    const wasPlaying = isPlaying
    if (wasPlaying) {
      audioElementRef.current.pause()
    }

    audioElementRef.current.src = audioUrls[selectedTrack].url
    audioElementRef.current.load()

    if (wasPlaying) {
      audioElementRef.current.play().catch(console.error)
    }
  }, [selectedTrack, audioUrls, isInitialized])

  // Handle position changes
  useEffect(() => {
    if (!pannerNodeRef.current) return
    pannerNodeRef.current.setPosition(...position)
  }, [position])

  // Handle auto-rotation
  useEffect(() => {
    if (!autoRotate || !isInitialized) return

    const rotationInterval = setInterval(() => {
      // Calculate new position based on rotation around the listener
      const radius = Math.sqrt(position[0] * position[0] + position[2] * position[2])
      const angle = Math.atan2(position[2], position[0]) + 0.05 // Small increment for rotation
      
      const newX = radius * Math.cos(angle)
      const newZ = radius * Math.sin(angle)
      
      setPosition([newX, position[1], newZ])
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [autoRotate, position, isInitialized])

  // Handle visualization toggle
  useEffect(() => {
    if (!isInitialized) return

    if (showVisualization) {
      startVisualization()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [showVisualization, isInitialized])

  // Toggle play/pause
  const togglePlay = () => {
    if (!isInitialized) {
      initializeAudio()
    }
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Start visualization
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Make sure canvas dimensions match its display size
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10
    
    // Adjusted for better visualization
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      
      analyserRef.current!.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw listener position (center)
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fill()
      
      // Calculate sound position on 2D plane
      const soundX = centerX + (position[0] * radius / 2)
      const soundZ = centerY - (position[2] * radius / 2) // Invert Z for screen coordinates
      
      // Draw outer ripple circles from sound source
      for (let i = 5; i >= 0; i--) {
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        const rippleRadius = (average / 256) * (i + 1) * 20
        
        ctx.beginPath()
        ctx.arc(soundX, soundZ, rippleRadius, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(138, 43, 226, ${0.7 - i * 0.1})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      // Draw sound source position
      ctx.beginPath()
      ctx.arc(soundX, soundZ, 12, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(138, 43, 226, 0.8)'
      ctx.fill()
      
      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(soundX, soundZ)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    draw()
  }

  // Position control handlers
  const handlePositionChange = (direction: 'left' | 'right' | 'front' | 'back' | 'up' | 'down') => {
    const [x, y, z] = position
    const step = 0.5
    
    switch (direction) {
      case 'left':
        setPosition([x - step, y, z])
        break
      case 'right':
        setPosition([x + step, y, z])
        break
      case 'front':
        setPosition([x, y, z - step])
        break
      case 'back':
        setPosition([x, y, z + step])
        break
      case 'up':
        setPosition([x, y + step, z])
        break
      case 'down':
        setPosition([x, y - step, z])
        break
    }
  }

  // Reset position
  const resetPosition = () => {
    setPosition([0, 0, -1])
  }

  return (
    <div className={cn("p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Compass className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Spatial Audio Experience</h3>
            <p className="text-xs text-white/60">3D sound positioning with HRTF technology</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="border-white/10 text-white hover:bg-white/5"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="default"
            onClick={togglePlay}
            className={isPlaying ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Visualization */}
        <div className="flex-1">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-black/50 border border-white/10 backdrop-blur-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            ></canvas>
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              Sound Position: [{position[0].toFixed(1)}, {position[1].toFixed(1)}, {position[2].toFixed(1)}]
            </div>
          </div>

          {/* Position controls */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('left')}
            >
              Left
            </Button>
            <div className="grid grid-rows-2 gap-2">
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
                onClick={() => handlePositionChange('front')}
              >
                Front
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
                onClick={() => handlePositionChange('back')}
              >
                Back
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('right')}
            >
              Right
            </Button>
          </div>

          {/* Up/Down and Reset */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('up')}
            >
              Up
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={resetPosition}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => handlePositionChange('down')}
            >
              Down
            </Button>
          </div>
        </div>

        {/* Right column - Controls */}
        <div className="flex-1 space-y-6">
          {/* Audio source selection */}
          <div className="space-y-2">
            <Label className="text-white">Audio Source</Label>
            <Select 
              value={selectedTrack.toString()} 
              onValueChange={(value) => setSelectedTrack(parseInt(value))}
            >
              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select a sound" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                {audioUrls.map((audio, index) => (
                  <SelectItem key={index} value={index.toString()} className="text-white hover:bg-white/10">
                    {audio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Volume control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Volume</Label>
              <span className="text-sm text-white/80">{volume}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              className="cursor-pointer"
            />
          </div>

          {/* Room size control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Room Size</Label>
              <span className="text-sm text-white/80">{(roomSize * 100).toFixed(0)}%</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[roomSize]}
              onValueChange={(value) => setRoomSize(value[0])}
              className="cursor-pointer"
            />
            <p className="text-xs text-white/60">
              Adjust perceived room size for the spatial audio effect
            </p>
          </div>

          {/* Reflection control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Reflection</Label>
              <span className="text-sm text-white/80">{(reflection * 100).toFixed(0)}%</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[reflection]}
              onValueChange={(value) => setReflection(value[0])}
              className="cursor-pointer"
            />
            <p className="text-xs text-white/60">
              Control the amount of sound reflection in the space
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-white/70" />
                <Label className="text-white cursor-pointer">Auto-rotate sound</Label>
              </div>
              <Switch
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanEye className="h-4 w-4 text-white/70" />
                <Label className="text-white cursor-pointer">Show visualization</Label>
              </div>
              <Switch
                checked={showVisualization}
                onCheckedChange={setShowVisualization}
              />
            </div>
          </div>

          {/* Usage tips */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">For best experience:</h4>
            <ul className="text-xs text-white/70 space-y-1 list-disc pl-4">
              <li>Use headphones for true 3D audio effect</li>
              <li>Try different positions to experience the spatial effect</li>
              <li>Enable auto-rotate for an immersive experience</li>
              <li>Experiment with different audio sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}