import { NextRequest, NextResponse } from "next/server"

interface RateLimitRule {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private rules: Map<string, RateLimitRule> = new Map()

  constructor() {
    // Define rate limiting rules for different endpoints
    this.rules.set('auth/login', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per 15 minutes
      skipSuccessfulRequests: true
    })

    this.rules.set('auth/register', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 registrations per hour
      skipSuccessfulRequests: true
    })

    this.rules.set('auth/forgot-password', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 password reset requests per hour
      skipSuccessfulRequests: true
    })

    this.rules.set('auth/verify-email', {
      windowMs: 10 * 60 * 1000, // 10 minutes
      maxRequests: 3, // 3 verification emails per 10 minutes
      skipSuccessfulRequests: true
    })

    this.rules.set('api/general', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
    })

    // Clean up old entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key]
      }
    })
  }

  private getKey(identifier: string, endpoint: string): string {
    return `${identifier}:${endpoint}`
  }

  private getRule(endpoint: string): RateLimitRule {
    // Check for specific endpoint rules
    for (const [pattern, rule] of this.rules.entries()) {
      if (endpoint.includes(pattern)) {
        return rule
      }
    }
    
    // Default to general API rule
    return this.rules.get('api/general')!
  }

  check(identifier: string, endpoint: string): {
    allowed: boolean
    limit: number
    current: number
    remaining: number
    resetTime: number
  } {
    const rule = this.getRule(endpoint)
    const key = this.getKey(identifier, endpoint)
    const now = Date.now()

    // Initialize or reset if window has passed
    if (!this.store[key] || this.store[key].resetTime <= now) {
      this.store[key] = {
        count: 0,
        resetTime: now + rule.windowMs
      }
    }

    const current = this.store[key].count
    const allowed = current < rule.maxRequests
    const remaining = Math.max(0, rule.maxRequests - current)

    return {
      allowed,
      limit: rule.maxRequests,
      current,
      remaining,
      resetTime: this.store[key].resetTime
    }
  }

  increment(identifier: string, endpoint: string, success: boolean = true): void {
    const rule = this.getRule(endpoint)
    const key = this.getKey(identifier, endpoint)
    
    // Skip counting based on rule configuration
    if (success && rule.skipSuccessfulRequests) return
    if (!success && rule.skipFailedRequests) return

    if (this.store[key]) {
      this.store[key].count++
    }
  }

  reset(identifier: string, endpoint: string): void {
    const key = this.getKey(identifier, endpoint)
    delete this.store[key]
  }

  getStatus(identifier: string, endpoint: string): {
    limited: boolean
    resetTime: number
    remaining: number
  } {
    const result = this.check(identifier, endpoint)
    return {
      limited: !result.allowed,
      resetTime: result.resetTime,
      remaining: result.remaining
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

export function getRateLimitHeaders(
  limit: number,
  current: number,
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'X-RateLimit-Used': current.toString(),
  }
}

export function createRateLimitResponse(
  resetTime: number,
  remaining: number = 0
): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)
  
  return NextResponse.json(
    {
      error: "Rate limit exceeded",
      message: `Too many requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
      resetTime: new Date(resetTime).toISOString()
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
      }
    }
  )
}

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    identifier?: string
    endpoint?: string
  }
): Promise<NextResponse> {
  // Get identifier (IP address or user ID)
  const identifier = options?.identifier || 
    request.ip || 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'unknown'

  // Get endpoint from URL
  const endpoint = options?.endpoint || 
    new URL(request.url).pathname.replace('/api/', '')

  // Check rate limit
  const rateLimitResult = rateLimiter.check(identifier, endpoint)

  // If rate limited, return error response
  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetTime, rateLimitResult.remaining)
  }

  try {
    // Execute the handler
    const response = await handler(request)
    
    // Increment counter based on response success
    const success = response.status >= 200 && response.status < 400
    rateLimiter.increment(identifier, endpoint, success)

    // Add rate limit headers to response
    const headers = getRateLimitHeaders(
      rateLimitResult.limit,
      rateLimitResult.current + 1,
      rateLimitResult.remaining - 1,
      rateLimitResult.resetTime
    )

    // Clone response to add headers
    const newResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...headers
      }
    })

    return newResponse
  } catch (error) {
    // Increment counter for failed requests
    rateLimiter.increment(identifier, endpoint, false)
    throw error
  }
}

// Middleware function for specific rate limiting
export function rateLimit(options?: {
  windowMs?: number
  maxRequests?: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    return withRateLimit(request, handler)
  }
}

// Export the rate limiter instance for advanced usage
export { rateLimiter }

// Helper function to check if user is rate limited
export function isRateLimited(identifier: string, endpoint: string): boolean {
  const result = rateLimiter.check(identifier, endpoint)
  return !result.allowed
}

// Helper function to get rate limit info
export function getRateLimitInfo(identifier: string, endpoint: string) {
  return rateLimiter.getStatus(identifier, endpoint)
}
