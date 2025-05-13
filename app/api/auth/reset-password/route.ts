import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import PasswordReset from "@/models/PasswordReset"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Parse the request body
    const body = await request.json()
    const { token, password } = body

    // Validate input
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Find the password reset record
    const passwordReset = await PasswordReset.findOne({
      token,
      expires: { $gt: new Date() },
      used: false,
    })

    if (!passwordReset) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Find the user
    const user = await User.findById(passwordReset.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update the user's password
    user.password = hashedPassword
    await user.save()

    // Mark the token as used
    passwordReset.used = true
    await passwordReset.save()

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
