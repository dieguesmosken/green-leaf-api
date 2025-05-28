import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Update user profile with display name
    await updateProfile(firebaseUser, {
      displayName: name
    })

    // Store additional user data in Firestore
    const userData = {
      uid: firebaseUser.uid,
      name,
      email,
      role: role || "farmer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await adminDb.collection('users').doc(firebaseUser.uid).set(userData)

    // Create custom token for consistent authentication
    const customToken = await adminAuth.createCustomToken(firebaseUser.uid)

    // Return user data and token
    const response = NextResponse.json(
      {
        success: true,
        user: {
          uid: firebaseUser.uid,
          name,
          email,
          role: role || "farmer"
        },
        token: customToken
      },
      { status: 201 }
    )

    // Set the token as an HTTP-only cookie
    response.cookies.set({
      name: "auth-token",
      value: customToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Registration error:", error)
      // Return specific Firebase error messages
    let errorMessage = "Registration failed"
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "User with this email already exists"
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters"
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address"
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
