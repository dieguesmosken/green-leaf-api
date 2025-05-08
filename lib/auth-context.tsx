"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "researcher" | "farmer"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes when API is not available
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "2",
    name: "Researcher User",
    email: "researcher@example.com",
    password: "password123",
    role: "researcher",
  },
  {
    id: "3",
    name: "Farmer User",
    email: "farmer@example.com",
    password: "password123",
    role: "farmer",
  },
]

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Helper function to check if API is available
const isApiAvailable = async (url: string): Promise<boolean> => {
  if (!isBrowser) return false

  try {
    // Use a simple HEAD request to check if the API is available
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if API is available
    if (isBrowser && apiAvailable === null) {
      isApiAvailable(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/`)
        .then((available) => {
          setApiAvailable(available)
        })
        .catch(() => {
          setApiAvailable(false)
        })
    }

    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setIsLoading(false)
  }, [apiAvailable])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // If we already know the API is not available, skip the API call
      if (apiAvailable !== false) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            },
          )

          if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            setUser(data.user)
            // Add a small delay to ensure state updates before resolving
            return new Promise<void>((resolve) => setTimeout(resolve, 100))
          }
        } catch (apiError) {
          console.log("API not available, using mock authentication")
          setApiAvailable(false)
        }
      }

      // Fallback to mock authentication
      const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (!mockUser) {
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userWithoutPassword } = mockUser
      const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      localStorage.setItem("token", mockToken)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      setUser(userWithoutPassword as User)
      // Add a small delay to ensure state updates before resolving
      return new Promise<void>((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true)
    try {
      // If we already know the API is not available, skip the API call
      if (apiAvailable !== false) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password, role }),
            },
          )

          if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            setUser(data.user)
            return
          }
        } catch (apiError) {
          console.log("API not available, using mock registration")
          setApiAvailable(false)
        }
      }

      // Fallback to mock registration
      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("User with this email already exists")
      }

      // Create new mock user
      const newUser = {
        id: `mock-${Math.random().toString(36).substring(2)}`,
        name,
        email,
        role: role as "admin" | "researcher" | "farmer",
      }

      const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      localStorage.setItem("token", mockToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      setUser(newUser)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
