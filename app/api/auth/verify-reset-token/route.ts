import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import PasswordReset from "@/models/PasswordReset"

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    // Parse the request body
    const body = await request.json()
    const { token } = body

    // Validate input
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
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

    return NextResponse.json({
      success: true,
      valid: true,
    })
  } catch (error: any) {
    console.error("Verify reset token error:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
