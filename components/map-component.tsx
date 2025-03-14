"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface MapComponentProps {
  coordinates: Coordinates
  onLocationSelect?: (location: string, coordinates: Coordinates) => void
}

export default function MapComponent({ coordinates, onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // This is a placeholder for a real map implementation
  useEffect(() => {
    // Simulate map loading
    setTimeout(() => {
      setIsMapLoaded(true)
    }, 1000)

    // In a real implementation, you would initialize a map library here
    // For example, with Google Maps:
    // const map = new google.maps.Map(mapRef.current, {
    //   center: { lat: coordinates.lat, lng: coordinates.lng },
    //   zoom: 10,
    // })
  }, [])

  const handleMapClick = (e: React.MouseEvent) => {
    if (!onLocationSelect) return

    // Get the relative click position within the map container
    const rect = mapRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert click position to "coordinates" (this is just a simulation)
    // In a real implementation, you would use the map library to convert screen coordinates to geographical coordinates
    const newLat = coordinates.lat + (y - rect.height / 2) / 1000
    const newLng = coordinates.lng + (x - rect.width / 2) / 1000

    // Generate a fake location name based on coordinates
    const locationName = `${newLat.toFixed(3)}, ${newLng.toFixed(3)}`

    onLocationSelect(locationName, { lat: newLat, lng: newLng })
  }

  return (
      <div
          ref={mapRef}
          className="w-full h-full bg-blue-900/30 relative overflow-hidden rounded-lg cursor-pointer"
          onClick={handleMapClick}
      >
        {!isMapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center text-white">Loading map...</div>
        ) : (
            <>
              {/* Simulated map content */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/20 via-blue-900/30 to-slate-900/40"></div>
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-white/5"></div>
                  ))}
                </div>
              </div>

              {/* Pin for the current location */}
              <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -100%)",
                  }}
              >
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-red-500 drop-shadow-glow animate-bounce" />
                  <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-slate-800 shadow-lg whitespace-nowrap">
                    {coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)}
                  </div>
                </div>
              </div>
            </>
        )}
      </div>
  )
}

