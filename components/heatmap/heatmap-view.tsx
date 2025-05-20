"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

const MAPBOX_TOKEN = "pk.eyJ1IjoiZGllZ3Vlc21vc2tlbiIsImEiOiJjbWF3Yzl4b3QwZTN4MmlwdjZsY2VzMHk3In0.QcF3fr58cjttqAM4AkbQlQ"

interface HeatmapViewProps {
  selectedHeatmap: string | null
  dateRange: { from: Date; to: Date }
  severityFilter: string[]
}

export function HeatmapView({ selectedHeatmap, dateRange, severityFilter }: HeatmapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [allData, setAllData] = useState<any[]>([])

  // Carregar JSON externo
  useEffect(() => {
    fetch("/pontos-infeccao.json")
      .then((res) => res.json())
      .then((geojson) => {
        setAllData(geojson.features)
      })
      .catch((err) => console.error("Erro ao carregar dados:", err))
  }, [])

  useEffect(() => {
    if (!mapContainer.current || allData.length === 0) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-47.5, -24.7],
        zoom: 8,
      })

      map.current.on("load", () => {
        map.current?.addControl(new mapboxgl.NavigationControl(), "top-right")
        map.current?.addControl(
          new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
          "top-right"
        )
        map.current?.addControl(new mapboxgl.ScaleControl(), "bottom-left")

        map.current?.addSource("infection-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: filterData(allData),
          },
        })

        map.current?.addLayer({
          id: "infection-heat",
          type: "heatmap",
          source: "infection-data",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "intensity"], 0, 0, 1, 1],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(33,102,172,0)",
              0.2, "rgb(103,169,207)",
              0.4, "rgb(209,229,240)",
              0.6, "rgb(253,219,199)",
              0.8, "rgb(239,138,98)",
              1, "rgb(178,24,43)",
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
            "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0.5],
          },
        })

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
              0, "#2dc937",
              0.25, "#e7b416",
              0.5, "#db7b2b",
              0.75, "#cc3232",
              1, "#80024e",
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "white",
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
          },
        })

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
              </div>`
            )
            .addTo(map.current as mapboxgl.Map)
        })

        map.current?.on("mouseenter", "infection-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current?.on("mouseleave", "infection-point", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })
      })
    }

    if (map.current && map.current.isStyleLoaded() && map.current.getSource("infection-data")) {
      const filtered = filterData(allData)
      ;(map.current.getSource("infection-data") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: filtered,
      })
    }
  }, [allData, selectedHeatmap, dateRange, severityFilter])

  return <div ref={mapContainer} className="h-full w-full" />
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

function filterData(data: any[]) {
  return data.filter((feature) => {
    const date = new Date(feature.properties.date)
    const severity = feature.properties.severity
    return (
      date >= new Date(window.heatmapDateRange?.from ?? 0) &&
      date <= new Date(window.heatmapDateRange?.to ?? Date.now()) &&
      window.heatmapSeverityFilter?.includes(severity)
    )
  })
}
