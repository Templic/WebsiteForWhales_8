/**
 * AlbumShowcase.tsx
 * 
 * Component Type: common
 * Migrated from imported components.
 */
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface Album {
  id: number
  title: string
  description: string
  image: string
  year: string
}

interface AlbumShowcaseProps {
  albums?: Album[]
  className?: string
}

// Default albums if none are provided
const defaultAlbums = [
  {
    id: 1,
    title: "Cosmic Healing Frequencies",
    description: "A journey through the chakras with healing frequencies",
    image: "/placeholder.jpg",
    year: "2023",
  },
  {
    id: 2,
    title: "Ethereal Meditation",
    description: "Ambient soundscapes for deep meditation",
    image: "/placeholder.jpg",
    year: "2022",
  },
  {
    id: 3,
    title: "Astral Projection",
    description: "Binaural beats for astral travel and lucid dreaming",
    image: "/placeholder.jpg",
    year: "2021",
  },
  {
    id: 4,
    title: "Quantum Resonance",
    description: "Harmonic frequencies aligned with universal constants",
    image: "/placeholder.jpg",
    year: "2020",
  },
]

export function AlbumShowcase({ albums = defaultAlbums, className }: AlbumShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === albums.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? albums.length - 1 : prevIndex - 1))
  }

  return (
    <div className={cn("relative w-full overflow-hidden py-10", className)}>
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous album</span>
        </Button>
      </div>

      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next album</span>
        </Button>
      </div>

      <div className="relative mx-auto flex max-w-5xl items-center justify-center">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {albums.map((album, index) => {
            // Calculate position relative to current index
            const position = (index - currentIndex + albums.length) % albums.length

            return (
              <div
                key={album.id}
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  position === 0
                    ? "z-20 scale-100 opacity-100 md:col-span-1"
                    : position === 1 || position === albums.length - 1
                      ? "z-10 scale-90 opacity-70"
                      : "scale-80 opacity-40",
                )}
              >
                <div className="overflow-hidden rounded-xl bg-black/20 p-4 backdrop-blur-sm">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={album.image || "/placeholder.jpg"}
                      alt={album.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 space-y-2 text-center">
                    <h3 className="text-lg font-bold text-white">{album.title}</h3>
                    <p className="text-sm text-white/70">{album.description}</p>
                    <p className="text-xs text-white/50">{album.year}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}