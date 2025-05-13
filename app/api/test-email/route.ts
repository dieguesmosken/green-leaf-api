import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, name } = body

    // Validate input
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Get the base URL for the reset link
    const baseUrl = request.nextUrl.origin
    const resetLink = `${baseUrl}/reset-password?token=test-token-12345`

    // Send a test email
    const emailSent = await emailService.sendPasswordResetEmail(email, name, resetLink)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
    })
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
