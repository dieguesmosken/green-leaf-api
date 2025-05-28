import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User, { IUserModel } from "@/models/User"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Parse the request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }    // Find user by credentials
    const user = await (User as IUserModel).findByCredentials(email, password)

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    })

    // Return user data (without password) and token
    const userData = user.toObject()
    delete userData.password

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
    })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })
    
    console.log('🍪 [DEBUG] Cookie definido com sucesso')
    console.log('✅ [DEBUG] Login bem-sucedido!')

    return response
  } catch (error: any) {
    console.error("❌ [DEBUG] Login error:", error.message)
    console.error("❌ [DEBUG] Stack trace:", error.stack)
    return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
  }
}
