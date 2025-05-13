import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import PasswordReset from "@/models/PasswordReset"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Parse the request body
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json({
        success: true,
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex")

    // Create a new password reset record
    const passwordReset = new PasswordReset({
      userId: user._id,
      token,
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    })

    await passwordReset.save()

    // Get the base URL for the reset link
    const baseUrl = request.nextUrl.origin
    const resetLink = `${baseUrl}/reset-password?token=${token}`

    // Send the password reset email using the new email service
    const emailSent = await sendPasswordResetEmail(user.email, user.name, resetLink)

    if (!emailSent) {
      console.error("Failed to send password reset email")
      // Don't reveal the failure to the user for security reasons
    }

    return NextResponse.json({
      success: true,
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
