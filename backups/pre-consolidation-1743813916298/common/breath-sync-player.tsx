/**
 * breath-sync-player.tsx
 * 
 * Component Type: common
 * Migrated from imported components.
 */
/**
 * breath-sync-player.tsx
 * 
 * IMPORTED COMPONENT
 * Originally from: tmp_import/components
 * 
 * This component was imported as part of the repository reorganization.
 * Modifications may be needed to ensure compatibility with the current codebase.
 */
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  TreesIcon as Lungs,
  Timer,
  Info,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  audioSrc: string
  coverArt: string
  chakra?: string
  frequency?: number
}

interface BreathPattern {
  id: number
  name: string
  description: string
  inhale: number // seconds
  hold1: number // seconds
  exhale: number // seconds
  hold2: number // seconds
  color: string
}

interface BreathSyncPlayerProps {
  tracks?: Track[]
  defaultVolume?: number
}

export function BreathSyncPlayer({
  tracks = [
    {
      id: 1,
      title: "Root Chakra Alignment",
      artist: "ASTRA",
      duration: "6:32",
      audioSrc: "/placeholder.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      chakra: "Root",
      frequency: 396,
    },
    {
      id: 2,
      title: "Sacral Awakening",
      artist: "ASTRA",
      duration: "7:14",
      audioSrc: "/placeholder.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      chakra: "Sacral",
      frequency: 417,
    },
    {
      id: 3,
      title: "Solar Plexus Activation",
      artist: "ASTRA",
      duration: "5:48",
      audioSrc: "/placeholder.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      chakra: "Solar Plexus",
      frequency: 528,
    },
    {
      id: 4,
      title: "Heart Resonance",
      artist: "ASTRA",
      duration: "8:21",
      audioSrc: "/placeholder.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      chakra: "Heart",
      frequency: 639,
    },
    {
      id: 5,
      title: "Throat Gateway",
      artist: "ASTRA",
      duration: "6:05",
      audioSrc: "/placeholder.mp3",
      coverArt: "/placeholder.svg?height=300&width=300",
      chakra: "Throat",
      frequency: 741,
    },
  ],
  defaultVolume = 80,
}: BreathSyncPlayerProps) {
  // Player state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(defaultVolume)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Breath sync state
  const [isBreathSyncActive, setIsBreathSyncActive] = useState(false)
  const [currentBreathPhase, setCurrentBreathPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [breathProgress, setBreathProgress] = useState(0)
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [customPattern, setCustomPattern] = useState<BreathPattern>({
    id: 0,
    name: "Custom",
    description: "Your custom breathing pattern",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 0,
    color: "#9333ea",
  })

  // Session state
  const [sessionDuration, setSessionDuration] = useState(5) // minutes
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(5 * 60) // seconds
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [breathCount, setBreathCount] = useState(0)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Current track
  const currentTrack = tracks[currentTrackIndex]

  // Breath patterns
  const breathPatterns: BreathPattern[] = [
    {
      id: 1,
      name: "Box Breathing",
      description: "Equal inhale, hold, exhale, hold for calm and focus",
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      color: "#9333ea",
    },
    {
      id: 2,
      name: "4-7-8 Breathing",
      description: "Relaxing breath for stress reduction and sleep",
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      color: "#3b82f6",
    },
    {
      id: 3,
      name: "Energizing Breath",
      description: "Quick inhales and long exhales for energy",
      inhale: 2,
      hold1: 0,
      exhale: 4,
      hold2: 0,
      color: "#f59e0b",
    },
    {
      id: 4,
      name: "Deep Relaxation",
      description: "Long, deep breaths for deep relaxation",
      inhale: 6,
      hold1: 2,
      exhale: 8,
      hold2: 0,
      color: "#10b981",
    },
    {
      id: 5,
      name: "Custom",
      description: "Your custom breathing pattern",
      inhale: customPattern.inhale,
      hold1: customPattern.hold1,
      exhale: customPattern.exhale,
      hold2: customPattern.hold2,
      color: customPattern.color,
    },
  ]

  // Current breath pattern
  const currentPattern = currentPatternIndex === 4 ? { ...customPattern } : breathPatterns[currentPatternIndex]

  // Total breath cycle duration in seconds
  const breathCycleDuration =
    currentPattern.inhale + currentPattern.hold1 + currentPattern.exhale + currentPattern.hold2

  // Initialize audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error)
          setIsPlaying(false)
        })
        startProgressTimer()
      } else {
        audioRef.current.pause()
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, currentTrackIndex])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Handle mute toggle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  // Handle breath sync
  useEffect(() => {
    if (isBreathSyncActive) {
      startBreathSync()
    } else {
      stopBreathSync()
    }

    return () => {
      stopBreathSync()
    }
  }, [isBreathSyncActive, currentPattern])

  // Handle session timer
  useEffect(() => {
    if (isSessionActive && isBreathSyncActive) {
      startSessionTimer()
    } else {
      stopSessionTimer()
    }

    return () => {
      stopSessionTimer()
    }
  }, [isSessionActive, isBreathSyncActive])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Update custom pattern in patterns array
  useEffect(() => {
    breathPatterns[4] = { ...customPattern }
  }, [customPattern])

  // Start progress timer for audio
  const startProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.ended) {
          nextTrack()
        } else {
          setCurrentTime(audioRef.current.currentTime)
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
      }
    }, 1000)
  }

  // Start breath synchronization
  const startBreathSync = () => {
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current)
    }

    // Start with inhale phase
    setCurrentBreathPhase("inhale")
    setBreathProgress(0)

    // Update every 100ms for smooth animation
    breathIntervalRef.current = setInterval(() => {
      setBreathProgress((prev) => {
        // Calculate new progress
        const increment = (0.1 / getCurrentPhaseSeconds()) * 100
        const newProgress = prev + increment

        // If current phase is complete, move to next phase
        if (newProgress >= 100) {
          moveToNextBreathPhase()
          return 0 // Reset progress for new phase
        }

        return newProgress
      })
    }, 100)
  }

  // Stop breath synchronization
  const stopBreathSync = () => {
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current)
      breathIntervalRef.current = null
    }
  }

  // Start session timer
  const startSessionTimer = () => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current)
    }

    setSessionTimeRemaining(sessionDuration * 60)

    sessionIntervalRef.current = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 1) {
          // Session complete
          setIsSessionActive(false)
          setIsBreathSyncActive(false)
          clearInterval(sessionIntervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Stop session timer
  const stopSessionTimer = () => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current)
      sessionIntervalRef.current = null
    }
  }

  // Get current phase duration in seconds
  const getCurrentPhaseSeconds = () => {
    switch (currentBreathPhase) {
      case "inhale":
        return currentPattern.inhale
      case "hold1":
        return currentPattern.hold1
      case "exhale":
        return currentPattern.exhale
      case "hold2":
        return currentPattern.hold2
      default:
        return 1
    }
  }

  // Move to next breath phase
  const moveToNextBreathPhase = () => {
    switch (currentBreathPhase) {
      case "inhale":
        if (currentPattern.hold1 > 0) {
          setCurrentBreathPhase("hold1")
        } else {
          setCurrentBreathPhase("exhale")
        }
        break
      case "hold1":
        setCurrentBreathPhase("exhale")
        break
      case "exhale":
        if (currentPattern.hold2 > 0) {
          setCurrentBreathPhase("hold2")
        } else {
          setCurrentBreathPhase("inhale")
          // Completed one full breath cycle
          setBreathCount((prev) => prev + 1)
        }
        break
      case "hold2":
        setCurrentBreathPhase("inhale")
        // Completed one full breath cycle
        setBreathCount((prev) => prev + 1)
        break
    }
  }

  // Format time for display
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle metadata loaded
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Player controls
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    setProgress(0)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    setProgress(0)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const onProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setProgress(value[0])
      setCurrentTime(newTime)
    }
  }

  const onVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Breath sync controls
  const toggleBreathSync = () => {
    setIsBreathSyncActive(!isBreathSyncActive)
  }

  const selectBreathPattern = (index: number) => {
    setCurrentPatternIndex(index)
  }

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive)
    if (!isSessionActive) {
      setBreathCount(0)
    }
  }

  // Update custom pattern
  const updateCustomPattern = (field: keyof BreathPattern, value: number) => {
    setCustomPattern((prev) => ({
      ...prev,
      [field]: value,
    }))
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

  // Get chakra color
  const getChakraColor = (chakra?: string) => {
    switch (chakra) {
      case "Root":
        return "#ff0000"
      case "Sacral":
        return "#ff8c00"
      case "Solar Plexus":
        return "#ffff00"
      case "Heart":
        return "#00ff00"
      case "Throat":
        return "#00bfff"
      case "Third Eye":
        return "#0000ff"
      case "Crown":
        return "#9400d3"
      default:
        return "#9333ea"
    }
  }

  // Get breath phase instruction
  const getBreathInstruction = () => {
    switch (currentBreathPhase) {
      case "inhale":
        return "Inhale"
      case "hold1":
        return "Hold"
      case "exhale":
        return "Exhale"
      case "hold2":
        return "Hold"
    }
  }

  // Calculate circle size based on breath phase
  const getCircleSize = () => {
    if (currentBreathPhase === "inhale") {
      return 50 + (breathProgress / 100) * 50 // 50% to 100%
    } else if (currentBreathPhase === "exhale") {
      return 100 - (breathProgress / 100) * 50 // 100% to 50%
    } else {
      return 100 // Hold phases maintain full size
    }
  }

  return (
    <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getChakraColor(currentTrack.chakra) }}
          >
            <Lungs className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Breath-Synchronized Player</h2>
            <p className="text-xs text-white/60">
              {isBreathSyncActive
                ? `${currentPattern.name} • ${getBreathInstruction()}`
                : "Synchronize music with your breath"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isBreathSyncActive ? "default" : "outline"}
            size="sm"
            onClick={toggleBreathSync}
            className={cn(
              isBreathSyncActive
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "border-white/10 text-white hover:bg-white/5",
            )}
          >
            {isBreathSyncActive ? "Sync Active" : "Start Sync"}
          </Button>
        </div>
      </div>

      <div ref={containerRef} className={cn(isFullscreen ? "h-screen" : "")}>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 border-r border-white/10">
            <div className="space-y-6">
              {/* Breath Visualization */}
              <div
                className="relative aspect-square rounded-lg overflow-hidden bg-black/40 flex items-center justify-center"
                style={{ backgroundColor: `${currentPattern.color}10` }}
              >
                {isBreathSyncActive ? (
                  <div className="flex flex-col items-center justify-center">
                    {/* Animated breathing circle */}
                    <div
                      className="rounded-full transition-all duration-100 ease-linear flex items-center justify-center"
                      style={{
                        width: `${getCircleSize()}%`,
                        height: `${getCircleSize()}%`,
                        backgroundColor: `${currentPattern.color}20`,
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderColor: currentPattern.color,
                      }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: "70%",
                          height: "70%",
                          backgroundColor: `${currentPattern.color}40`,
                        }}
                      ></div>
                    </div>

                    {/* Breath instruction */}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                      <h3 className="text-2xl font-bold" style={{ color: currentPattern.color }}>
                        {getBreathInstruction()}
                      </h3>
                      <p className="text-white/70">
                        {getCurrentPhaseSeconds() - ((breathProgress / 100) * getCurrentPhaseSeconds()).toFixed(0)}s
                      </p>
                    </div>

                    {/* Pattern name */}
                    <div className="absolute top-4 left-0 right-0 text-center">
                      <p className="text-sm font-medium" style={{ color: currentPattern.color }}>
                        {currentPattern.name}
                      </p>
                    </div>

                    {/* Session info */}
                    {isSessionActive && (
                      <div className="absolute top-4 right-4 bg-black/40 rounded-lg px-2 py-1 text-xs text-white/70">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>{formatTime(sessionTimeRemaining)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Lungs className="h-3 w-3" />
                          <span>{breathCount} breaths</span>
                        </div>
                      </div>
                    )}

                    {/* Fullscreen toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="absolute top-4 left-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Lungs className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Breath Synchronization</h3>
                    <p className="text-white/70 mb-6">
                      Activate breath sync to follow guided breathing patterns while listening to healing frequencies
                    </p>
                    <Button
                      onClick={toggleBreathSync}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                    >
                      Start Breath Sync
                    </Button>
                  </div>
                )}
              </div>

              {/* Audio Player Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: `${getChakraColor(currentTrack.chakra)}20` }}
                  >
                    <Image
                      src={currentTrack.coverArt || "/placeholder.svg"}
                      alt={currentTrack.title}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{currentTrack.title}</h3>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-white/60 truncate">{currentTrack.artist}</p>
                      {currentTrack.frequency && (
                        <>
                          <span className="text-white/40">•</span>
                          <p className="text-xs text-white/60 truncate">{currentTrack.frequency} Hz</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                  <Slider value={[progress]} min={0} max={100} step={0.1} onValueChange={onProgressChange} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                    </Button>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={onVolumeChange}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={prevTrack} className="text-white hover:bg-white/10">
                      <SkipBack className="h-5 w-5" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextTrack} className="text-white hover:bg-white/10">
                      <SkipForward className="h-5 w-5" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                  <div className="w-[88px]"></div> {/* Spacer to balance layout */}
                </div>
              </div>

              <audio
                ref={audioRef}
                src={currentTrack.audioSrc}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={nextTrack}
              />
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="patterns" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1">
                <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-900/50">
                  Breath Patterns
                </TabsTrigger>
                <TabsTrigger value="session" className="data-[state=active]:bg-purple-900/50">
                  Session Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patterns" className="mt-4 space-y-4">
                <div className="space-y-3">
                  {breathPatterns.slice(0, 4).map((pattern, index) => (
                    <button
                      key={pattern.id}
                      onClick={() => selectBreathPattern(index)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors",
                        currentPatternIndex === index
                          ? "bg-black/40 border border-purple-500/30"
                          : "bg-black/20 hover:bg-black/30",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium" style={{ color: pattern.color }}>
                            {pattern.name}
                          </h3>
                          <p className="text-xs text-white/60">{pattern.description}</p>
                        </div>
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${pattern.color}20` }}
                        >
                          <Lungs className="h-4 w-4" style={{ color: pattern.color }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                        <div className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          <span>In: {pattern.inhale}s</span>
                        </div>
                        {pattern.hold1 > 0 && (
                          <div className="flex items-center gap-1">
                            <Pause className="h-3 w-3" />
                            <span>Hold: {pattern.hold1}s</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <ArrowLeft className="h-3 w-3" />
                          <span>Out: {pattern.exhale}s</span>
                        </div>
                        {pattern.hold2 > 0 && (
                          <div className="flex items-center gap-1">
                            <Pause className="h-3 w-3" />
                            <span>Hold: {pattern.hold2}s</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}

                  {/* Custom Pattern */}
                  <div
                    className={cn(
                      "p-3 rounded-lg transition-colors",
                      currentPatternIndex === 4 ? "bg-black/40 border border-purple-500/30" : "bg-black/20",
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium" style={{ color: customPattern.color }}>
                          Custom Pattern
                        </h3>
                        <p className="text-xs text-white/60">Create your own breathing pattern</p>
                      </div>
                      <Button
                        variant={currentPatternIndex === 4 ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectBreathPattern(4)}
                        className={cn(
                          currentPatternIndex === 4
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "border-white/10 text-white hover:bg-white/5",
                        )}
                      >
                        {currentPatternIndex === 4 ? "Selected" : "Select"}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white/70">Inhale (seconds)</label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("inhale", Math.max(1, customPattern.inhale - 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.inhale <= 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-white">{customPattern.inhale}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("inhale", Math.min(10, customPattern.inhale + 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.inhale >= 10}
                            >
                              <ChevronUp className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white/70">Hold After Inhale (seconds)</label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("hold1", Math.max(0, customPattern.hold1 - 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.hold1 <= 0}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-white">{customPattern.hold1}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("hold1", Math.min(10, customPattern.hold1 + 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.hold1 >= 10}
                            >
                              <ChevronUp className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white/70">Exhale (seconds)</label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("exhale", Math.max(1, customPattern.exhale - 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.exhale <= 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-white">{customPattern.exhale}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("exhale", Math.min(10, customPattern.exhale + 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.exhale >= 10}
                            >
                              <ChevronUp className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white/70">Hold After Exhale (seconds)</label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("hold2", Math.max(0, customPattern.hold2 - 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.hold2 <= 0}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-white">{customPattern.hold2}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCustomPattern("hold2", Math.min(10, customPattern.hold2 + 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={customPattern.hold2 >= 10}
                            >
                              <ChevronUp className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-purple-400" />
                    <h3 className="font-medium text-white">Breath Pattern Benefits</h3>
                  </div>
                  <p className="text-sm text-white/80">
                    Different breath patterns activate different parts of your nervous system. Box breathing calms the
                    mind, 4-7-8 breathing promotes relaxation, and energizing breath increases alertness. Experiment to
                    find what works best for your current needs.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="session" className="mt-4 space-y-4">
                <div className="rounded-lg bg-black/40 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Timed Session</h3>
                      <p className="text-xs text-white/60">Set a duration for your breathing practice</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isSessionActive}
                        onCheckedChange={toggleSession}
                        disabled={!isBreathSyncActive}
                      />
                      <span className="text-sm text-white/60">{isSessionActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>

                  {isBreathSyncActive ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white/70">Session Duration (minutes)</label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSessionDuration(Math.max(1, sessionDuration - 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={sessionDuration <= 1 || isSessionActive}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-white">{sessionDuration}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSessionDuration(Math.min(60, sessionDuration + 1))}
                              className="h-6 w-6 rounded-full bg-black/40 text-white hover:bg-black/60"
                              disabled={sessionDuration >= 60 || isSessionActive}
                            >
                              <ChevronUp className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {isSessionActive && (
                        <div className="rounded-lg bg-purple-900/20 border border-purple-500/30 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-purple-400" />
                              <span className="text-white">Session Progress</span>
                            </div>
                            <span className="text-white">{formatTime(sessionTimeRemaining)}</span>
                          </div>
                          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${(1 - sessionTimeRemaining / (sessionDuration * 60)) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="mt-2 text-center text-sm text-white/60">
                            {breathCount} breath cycles completed
                          </div>
                        </div>
                      )}

                      <div className="flex justify-center pt-2">
                        <Button
                          variant={isSessionActive ? "destructive" : "default"}
                          onClick={toggleSession}
                          disabled={!isBreathSyncActive}
                        >
                          {isSessionActive ? "End Session" : "Start Timed Session"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-black/20 p-4 text-center">
                      <p className="text-white/60">Activate breath synchronization to enable timed sessions</p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-black/40 p-4">
                  <h3 className="font-medium text-white mb-3">Quick Presets</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15, 20, 30, 45].map((mins) => (
                      <Button
                        key={mins}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5"
                        onClick={() => {
                          setSessionDuration(mins)
                          if (isBreathSyncActive && !isSessionActive) {
                            setIsSessionActive(true)
                          }
                        }}
                        disabled={!isBreathSyncActive || isSessionActive}
                      >
                        {mins} min
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-purple-400" />
                    <h3 className="font-medium text-white">Session Tips</h3>
                  </div>
                  <p className="text-sm text-white/80">
                    For beginners, start with 5-10 minute sessions and gradually increase duration as you become more
                    comfortable. Consistency is more important than length—even short daily sessions can provide
                    significant benefits for stress reduction and mental clarity.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

