"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Layers, 
  Star, 
  Sparkles, 
  Flame, 
  Cloud,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SoundLayer {
  name: string;
  type: "ambient" | "healing" | "rhythmic";
  active: boolean;
  volume: number;
  icon: React.ReactNode;
  color: string;
}

export function MultidimensionalSoundJourney() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState("earth");
  const [spatialDepth, setSpatialDepth] = useState(60);
  const [rotationSpeed, setRotationSpeed] = useState(30);
  
  // Sound layers for the multidimensional experience
  const [soundLayers, setSoundLayers] = useState<SoundLayer[]>([
    { 
      name: "Cosmic Drone", 
      type: "ambient", 
      active: true, 
      volume: 65,
      icon: <Star className="h-4 w-4" />,
      color: "#00e6e6"
    },
    { 
      name: "Crystal Bowls", 
      type: "healing", 
      active: true, 
      volume: 50,
      icon: <Sparkles className="h-4 w-4" />,
      color: "#9333ea"
    },
    { 
      name: "Earth Rhythms", 
      type: "rhythmic", 
      active: false, 
      volume: 40,
      icon: <Flame className="h-4 w-4" />,
      color: "#f59e0b"
    },
    { 
      name: "Galactic Waves", 
      type: "ambient", 
      active: true, 
      volume: 55,
      icon: <Cloud className="h-4 w-4" />,
      color: "#3b82f6"
    },
    { 
      name: "Healing Frequency", 
      type: "healing", 
      active: true, 
      volume: 60,
      icon: <Zap className="h-4 w-4" />,
      color: "#10b981"
    }
  ]);

  // Dimensional presets
  const dimensions = [
    {
      id: "earth",
      name: "Earth Realm",
      description: "Grounding frequencies that anchor consciousness in physical reality",
      spatialDepth: 40,
      rotation: 20
    },
    {
      id: "astral",
      name: "Astral Plane",
      description: "Expansive soundscape for lucid dreaming and astral projection",
      spatialDepth: 70,
      rotation: 50
    },
    {
      id: "celestial",
      name: "Celestial Sphere",
      description: "Higher dimensional frequencies for spiritual alignment",
      spatialDepth: 90,
      rotation: 60
    },
    {
      id: "quantum",
      name: "Quantum Field",
      description: "Non-linear sonic patterns that transcend space-time",
      spatialDepth: 100,
      rotation: 85
    }
  ];

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle layer active state
  const toggleLayer = (index: number) => {
    const updatedLayers = [...soundLayers];
    updatedLayers[index].active = !updatedLayers[index].active;
    setSoundLayers(updatedLayers);
  };

  // Update layer volume
  const updateLayerVolume = (index: number, volume: number) => {
    const updatedLayers = [...soundLayers];
    updatedLayers[index].volume = volume;
    setSoundLayers(updatedLayers);
  };

  // Apply dimension preset
  const applyDimension = (dimensionId: string) => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    if (dimension) {
      setSelectedDimension(dimensionId);
      setSpatialDepth(dimension.spatialDepth);
      setRotationSpeed(dimension.rotation);
    }
  };

  // Current dimension
  const currentDimension = dimensions.find(d => d.id === selectedDimension) || dimensions[0];

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Multidimensional Sound Journey</h2>
            <p className="text-xs text-white/60">
              {isPlaying ? `Now playing: ${currentDimension.name}` : "Layer frequencies across dimensions"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="border-white/10 text-white hover:bg-white/5"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-6 border-r border-white/10">
          <div className="space-y-6">
            {/* Visualization */}
            <div 
              className="h-40 rounded-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(45deg, #000e17, #004059, #000e17)",
                boxShadow: "inset 0 0 30px rgba(0,230,230,0.3)"
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Rotating circles to represent dimensionality */}
                  {[0, 1, 2, 3].map((index) => (
                    <div 
                      key={index} 
                      className="absolute rounded-full border opacity-60"
                      style={{
                        top: -((index + 1) * 15),
                        left: -((index + 1) * 15),
                        width: `${(index + 1) * 30}px`,
                        height: `${(index + 1) * 30}px`,
                        borderColor: `rgba(0, 230, 230, ${0.8 - index * 0.2})`,
                        borderWidth: index === 3 ? "3px" : "1px",
                        animation: `spin ${8 - index}s linear infinite`,
                        transform: `rotate(${index * 45}deg)`,
                      }}
                    />
                  ))}

                  {/* Center sphere */}
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-cyan-500/30 to-cyan-900/30"
                    style={{
                      boxShadow: "0 0 15px rgba(0, 230, 230, 0.5)"
                    }}
                  >
                    <Layers className="h-6 w-6 text-cyan-300" />
                  </div>
                </div>
              </div>

              {/* Active layers indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                {soundLayers.filter(layer => layer.active).length} active layers
              </div>

              {/* Dimensional info */}
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                {currentDimension.name}
              </div>
            </div>

            {/* Main Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm">Master Volume: {masterVolume}%</span>
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="h-6 w-6 text-white">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Slider
                  value={[masterVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setMasterVolume(value[0])}
                  disabled={isMuted}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">Spatial Depth: {spatialDepth}%</span>
                </div>
                <Slider
                  value={[spatialDepth]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSpatialDepth(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">Rotation Speed: {rotationSpeed}%</span>
                </div>
                <Slider
                  value={[rotationSpeed]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setRotationSpeed(value[0])}
                  className="py-2"
                />
              </div>
            </div>

            {/* Play Button */}
            <div className="flex justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="layers" className="space-y-4">
            <TabsList className="grid grid-cols-2 bg-black/40">
              <TabsTrigger value="layers">Sound Layers</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="space-y-4">
              <div className="space-y-3">
                {soundLayers.map((layer, index) => (
                  <div key={index} className={cn(
                    "p-3 rounded-lg transition-colors border", 
                    layer.active ? "bg-black/20 border-cyan-500/30" : "bg-black/10 border-white/5"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${layer.color}30` }}>
                          <div className="text-cyan-400">{layer.icon}</div>
                        </div>
                        <span className={cn("font-medium", layer.active ? "text-white" : "text-white/50")}>{layer.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLayer(index)}
                        className={cn(
                          "h-7 text-xs",
                          layer.active 
                            ? "bg-cyan-950/30 hover:bg-cyan-900/40 border-cyan-500/30" 
                            : "bg-transparent hover:bg-white/5 border-white/10"
                        )}
                      >
                        {layer.active ? "Active" : "Disabled"}
                      </Button>
                    </div>
                    <Slider
                      value={[layer.volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateLayerVolume(index, value[0])}
                      disabled={!layer.active}
                      className="py-2"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              <div className="grid gap-3">
                {dimensions.map((dimension) => (
                  <div
                    key={dimension.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border",
                      selectedDimension === dimension.id 
                        ? "bg-cyan-950/30 border-cyan-500/20" 
                        : "border-white/5"
                    )}
                    onClick={() => applyDimension(dimension.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: selectedDimension === dimension.id ? "#00e6e6" : "#808080"
                        }} 
                      />
                      <h4 className="font-medium text-white">{dimension.name}</h4>
                    </div>
                    <p className="text-xs text-white/60 mt-1 ml-5">{dimension.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <p className="text-sm text-white/80">
              <span className="text-cyan-400 font-semibold">How It Works:</span> Multiple frequency layers interact to create three-dimensional sound that spirals through space, engaging different parts of your consciousness and opening portals to higher dimensions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}