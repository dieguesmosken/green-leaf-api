"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// This would normally come from an environment variable
// For demo purposes, we're using a public token with restricted capabilities
const MAPBOX_TOKEN = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xvNXE4eTNhMDJ1cjJrcGR5ZDUxYnp6ZiJ9.3DHC0j5UvyC8NZ1qKGtLGQ"

interface HeatmapViewProps {
  selectedHeatmap: string | null
  dateRange: { from: Date; to: Date }
  severityFilter: string[]
}

export function HeatmapView({ selectedHeatmap, dateRange, severityFilter }: HeatmapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-47.05, -23.45], // Vale do Ribeira region in Brazil
        zoom: 9,
      })

      map.current.on("load", () => {
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right")

        // Add a geolocation control
        map.current?.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "top-right",
        )

        // Add a scale control
        map.current?.addControl(new mapboxgl.ScaleControl(), "bottom-left")

        // Add heatmap source
        map.current?.addSource("infection-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: generateMockHeatmapData(),
          },
        })

        // Add heatmap layer
        map.current?.addLayer({
          id: "infection-heat",
          type: "heatmap",
          source: "infection-data",
          paint: {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": ["interpolate", ["linear"], ["get", "intensity"], 0, 0, 1, 1],
            // Increase the heatmap color weight weight by zoom level
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0.5],
          },
        })

        // Add point layer for individual data points
        map.current?.addLayer({
          id: "infection-point",
          type: "circle",
          source: "infection-data",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 1, 16, 6],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0,
              "#2dc937",
              0.25,
              "#e7b416",
              0.5,
              "#db7b2b",
              0.75,
              "#cc3232",
              1,
              "#80024e",
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "white",
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
          },
        })

        // Add popup on click
        map.current?.on("click", "infection-point", (e) => {
          if (!e.features || e.features.length === 0) return

          const feature = e.features[0]
          const coordinates = feature.geometry.coordinates.slice()
          const intensity = feature.properties?.intensity || 0
          const severity = getSeverityLabel(intensity)
          const date = new Date(feature.properties?.date).toLocaleDateString()

          new mapboxgl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(
              `<div class="p-2">
                <h3 class="font-bold">Infection Data</h3>
                <p>Intensity: ${(intensity * 100).toFixed(1)}%</p>
                <p>Severity: ${severity}</p>
                <p>Date: ${date}</p>
              </div>`,
            )
            .addTo(map.current as mapboxgl.Map)
        })

        // Change cursor on hover
        map.current?.on("mouseenter", "infection-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current?.on("mouseleave", "infection-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })
      })
    }

    // Update the map when filters change
    if (map.current && map.current.isStyleLoaded() && map.current.getSource("infection-data")) {
      const filteredData = generateMockHeatmapData().filter((feature) => {
        const featureDate = new Date(feature.properties.date)
        const intensity = feature.properties.intensity
        const severity = getSeverityFromIntensity(intensity)

        return featureDate >= dateRange.from && featureDate <= dateRange.to && severityFilter.includes(severity)
      })
      ;(map.current.getSource("infection-data") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: filteredData,
      })
    }

    return () => {
      // No need to destroy the map on component unmount
      // as we want to keep it around for filter changes
    }
  }, [selectedHeatmap, dateRange, severityFilter])

  return <div ref={mapContainer} className="h-full w-full" />
}

// Helper function to generate mock heatmap data
function generateMockHeatmapData() {
  const features = []
  const centerLng = -47.05
  const centerLat = -23.45
  const radius = 0.2

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * radius
    const lng = centerLng + distance * Math.cos(angle)
    const lat = centerLat + distance * Math.sin(angle)
    const intensity = Math.random()

    // Generate a random date within the last 3 months
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    features.push({
      type: "Feature",
      properties: {
        intensity,
        date: date.toISOString(),
        severity: getSeverityFromIntensity(intensity),
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    })
  }

  return features
}

function getSeverityFromIntensity(intensity: number): string {
  if (intensity < 0.1) return "none"
  if (intensity < 0.3) return "low"
  if (intensity < 0.6) return "medium"
  if (intensity < 0.8) return "high"
  return "severe"
}

function getSeverityLabel(intensity: number): string {
  return getSeverityFromIntensity(intensity).charAt(0).toUpperCase() + getSeverityFromIntensity(intensity).slice(1)
}
