import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Parse the request body
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "farmer",
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    })

    // Return user data (without password) and token
    const userData = user.toObject()
    delete userData.password

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 201 },
    )

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during registration" }, { status: 500 })
  }
}
