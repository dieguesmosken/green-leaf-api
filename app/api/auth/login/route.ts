import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Get additional user data from Firestore
    const userDoc = await adminDb.collection('users').doc(firebaseUser.uid).get()
    let userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      role: 'farmer' // default role
    }

    if (userDoc.exists) {
      const firestoreData = userDoc.data()
      userData = {
        ...userData,
        ...firestoreData
      }
    }

    // Create custom token for consistent authentication
    const customToken = await adminAuth.createCustomToken(firebaseUser.uid)

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
      token: customToken
    })

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
    console.error("Login error:", error)
    
    // Return specific Firebase error messages
    let errorMessage = "Invalid login credentials"
    if (error.code === 'auth/user-not-found') {
      errorMessage = "No user found with this email"
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid email or password"
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed login attempts. Please try again later."
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 401 })
  }
}
