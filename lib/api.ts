import { toast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Cache for API availability status
let isApiAvailableCache: boolean | null = null

// Helper function to check if API is available
const checkApiAvailability = async (): Promise<boolean> => {
  if (isApiAvailableCache !== null) {
    return isApiAvailableCache
  }

  try {
    // Use a simple HEAD request to check if the API is available
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch(`${API_URL}/`, {
      method: "HEAD",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    isApiAvailableCache = response.ok
    return isApiAvailableCache
  } catch (error) {
    isApiAvailableCache = false
    return false
  }
}

// Mock data for when the API is not available
const MOCK_DATA = {
  images: Array.from({ length: 50 }).map((_, i) => ({
    id: `img-${i + 1}`,
    fileName: `cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
    originalName: `cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
    filePath: `/uploads/cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
    uploadedBy: ["John Doe", "Jane Smith", "Maria Garcia", "Robert Johnson"][Math.floor(Math.random() * 4)],
    location: {
      type: "Point",
      coordinates: [-47.05 + (Math.random() - 0.5) * 0.2, -23.45 + (Math.random() - 0.5) * 0.2],
    },
    metadata: {
      deviceInfo: "Mock Device",
      captureDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      imageSize: Math.floor(Math.random() * 5000000) + 1000000,
    },
    status: ["pending", "analyzed", "failed"][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  })),

  analyses: Array.from({ length: 50 }).map((_, i) => ({
    id: `analysis-${i + 1}`,
    image: `img-${i + 1}`,
    infectionProbability: Math.random(),
    infectionSeverity: ["none", "low", "medium", "high", "severe"][Math.floor(Math.random() * 5)],
    detectedAreas: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(() => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      width: Math.floor(Math.random() * 50) + 10,
      height: Math.floor(Math.random() * 50) + 10,
      confidence: Math.random(),
    })),
    modelVersion: ["1.0.0", "1.1.0", "1.2.0"][Math.floor(Math.random() * 3)],
    analysisDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    verifiedBy: Math.random() > 0.7 ? `user-${Math.floor(Math.random() * 3) + 1}` : null,
  })),

  heatmaps: Array.from({ length: 5 }).map((_, i) => ({
    id: `heatmap-${i + 1}`,
    name: ["Infection Rate", "Severity Level", "Time Progression", "Regional Analysis", "Seasonal Patterns"][i],
    description: `Heatmap showing ${["infection rates", "severity levels", "time progression", "regional analysis", "seasonal patterns"][i]} of bacterial infections`,
    region: {
      type: "Polygon",
      coordinates: [
        [
          [-47.15, -23.55],
          [-47.0, -23.55],
          [-47.0, -23.35],
          [-47.15, -23.35],
          [-47.15, -23.55],
        ],
      ],
    },
    dataPoints: Array.from({ length: 50 }).map(() => ({
      location: {
        type: "Point",
        coordinates: [-47.05 + (Math.random() - 0.5) * 0.2, -23.45 + (Math.random() - 0.5) * 0.2],
      },
      intensity: Math.random(),
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    })),
    createdBy: `user-${Math.floor(Math.random() * 3) + 1}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  })),
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    // Check if API is available first
    const apiAvailable = await checkApiAvailability()

    // If API is available, try to fetch from the real API
    if (apiAvailable) {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        })

        if (response.ok) {
          return await response.json()
        }
      } catch (apiError) {
        console.log(`API request failed for ${endpoint}, using mock data`)
        isApiAvailableCache = false
      }
    } else {
      // Skip API call if we already know it's not available
      console.log(`Using mock data for ${endpoint} (API unavailable)`)
    }

    // If API is not available or returns an error, use mock data
    return getMockData(endpoint, options)
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    toast({
      title: "API Error",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    })
    throw error
  }
}

// Function to return mock data based on the endpoint
function getMockData(endpoint: string, options: RequestInit) {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Handle different endpoints
      if (endpoint.startsWith("/api/images")) {
        if (endpoint === "/api/images") {
          resolve(MOCK_DATA.images)
        } else {
          const id = endpoint.split("/").pop()
          resolve(MOCK_DATA.images.find((img) => img.id === id) || null)
        }
      } else if (endpoint.startsWith("/api/analyses")) {
        if (endpoint === "/api/analyses") {
          resolve(MOCK_DATA.analyses)
        } else {
          const id = endpoint.split("/").pop()
          resolve(MOCK_DATA.analyses.find((analysis) => analysis.id === id) || null)
        }
      } else if (endpoint.startsWith("/api/heatmaps")) {
        if (endpoint === "/api/heatmaps") {
          resolve(MOCK_DATA.heatmaps)
        } else if (endpoint === "/api/heatmaps/generate") {
          // Generate a new heatmap
          const newHeatmap = {
            id: `heatmap-${MOCK_DATA.heatmaps.length + 1}`,
            name: "Generated Heatmap",
            description: "Automatically generated heatmap",
            region: {
              type: "Polygon",
              coordinates: [
                [
                  [-47.15, -23.55],
                  [-47.0, -23.55],
                  [-47.0, -23.35],
                  [-47.15, -23.35],
                  [-47.15, -23.55],
                ],
              ],
            },
            dataPoints: Array.from({ length: 50 }).map(() => ({
              location: {
                type: "Point",
                coordinates: [-47.05 + (Math.random() - 0.5) * 0.2, -23.45 + (Math.random() - 0.5) * 0.2],
              },
              intensity: Math.random(),
              date: new Date().toISOString(),
            })),
            createdBy: "user-1",
            createdAt: new Date().toISOString(),
          }
          resolve(newHeatmap)
        } else {
          const id = endpoint.split("/").pop()
          resolve(MOCK_DATA.heatmaps.find((heatmap) => heatmap.id === id) || null)
        }
      } else {
        // Default response for unhandled endpoints
        resolve({ message: "Mock data not available for this endpoint" })
      }
    }, 500) // 500ms delay to simulate network
  })
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchWithAuth("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: string) =>
    fetchWithAuth("/api/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  // Users
  getUsers: () => fetchWithAuth("/api/users"),
  getUserById: (id: string) => fetchWithAuth(`/api/users/${id}`),
  updateUser: (id: string, data: any) =>
    fetchWithAuth(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Images
  getImages: () => fetchWithAuth("/api/images"),
  getImageById: (id: string) => fetchWithAuth(`/api/images/${id}`),
  uploadImage: (formData: FormData) =>
    fetchWithAuth("/api/images", {
      method: "POST",
      headers: {}, // Let the browser set the content type for FormData
      body: formData,
    }),
  updateImage: (id: string, data: any) =>
    fetchWithAuth(`/api/images/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteImage: (id: string) =>
    fetchWithAuth(`/api/images/${id}`, {
      method: "DELETE",
    }),

  // Analyses
  getAnalyses: () => fetchWithAuth("/api/analyses"),
  getAnalysisById: (id: string) => fetchWithAuth(`/api/analyses/${id}`),
  createAnalysis: (data: any) =>
    fetchWithAuth("/api/analyses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAnalysis: (id: string, data: any) =>
    fetchWithAuth(`/api/analyses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteAnalysis: (id: string) =>
    fetchWithAuth(`/api/analyses/${id}`, {
      method: "DELETE",
    }),

  // Heatmaps
  getHeatmaps: () => fetchWithAuth("/api/heatmaps"),
  getHeatmapById: (id: string) => fetchWithAuth(`/api/heatmaps/${id}`),
  createHeatmap: (data: any) =>
    fetchWithAuth("/api/heatmaps", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateHeatmap: (id: string, data: any) =>
    fetchWithAuth(`/api/heatmaps/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteHeatmap: (id: string) =>
    fetchWithAuth(`/api/heatmaps/${id}`, {
      method: "DELETE",
    }),
  generateHeatmap: (data: any) =>
    fetchWithAuth("/api/heatmaps/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
