import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Tentando obter informações do usuário...')
    
    // Get token from cookies
    const token = request.cookies.get("token")?.value
    console.log('🍪 [DEBUG] Token do cookie:', token ? `${token.substring(0, 20)}...` : 'NENHUM')

    if (!token) {
      console.log('❌ [DEBUG] Token não encontrado nos cookies')
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    console.log('🔐 [DEBUG] Verificando token...')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    console.log('✅ [DEBUG] Token válido, ID do usuário:', decoded.id)

    // Connect to the database
    console.log('🔌 [DEBUG] Conectando ao banco...')
    await connectToDatabase()
    console.log('✅ [DEBUG] Conectado ao banco')

    // Find user by ID
    console.log('👤 [DEBUG] Buscando usuário por ID...')
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      console.log('❌ [DEBUG] Usuário não encontrado no banco')
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log('✅ [DEBUG] Usuário encontrado:', user.name)
    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("❌ [DEBUG] Auth error:", error.message)
    console.error("❌ [DEBUG] Stack trace:", error.stack)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    // Get request body
    const body = await request.json()
    const { name, email, bio, avatar } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Connect to the database
    await connectToDatabase()

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: decoded.id },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        email,
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      { new: true, runValidators: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error: any) {
    console.error("Update user error:", error)

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
