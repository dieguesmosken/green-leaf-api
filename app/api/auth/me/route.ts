import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    // Connect to the database
    await connectToDatabase()

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}
