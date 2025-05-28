import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getStorage } from "firebase-admin/storage"
import { getFirestore } from "firebase-admin/firestore"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin"

// Inicializar Firebase Admin
initializeFirebaseAdmin()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await getAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    // Buscar uploads do usuário no Firestore
    const db = getFirestore()
    const uploadsRef = db.collection('uploads').where('userId', '==', userId)
    const snapshot = await uploadsRef.get()

    const uploads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate?.() || new Date(doc.data().uploadedAt)
    }))

    return NextResponse.json({ uploads })

  } catch (error) {
    console.error('Erro ao buscar uploads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await getAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    const body = await request.json()
    const { fileName, fileUrl, fileSize, folder, metadata } = body

    // Salvar informações do upload no Firestore
    const db = getFirestore()
    const uploadData = {
      userId,
      name: fileName,
      url: fileUrl,
      size: fileSize,
      folder,
      uploadedAt: new Date(),
      metadata: metadata || {}
    }

    const docRef = await db.collection('uploads').add(uploadData)

    return NextResponse.json({ 
      success: true, 
      uploadId: docRef.id,
      upload: { id: docRef.id, ...uploadData }
    })

  } catch (error) {
    console.error('Erro ao salvar upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await getAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    const { searchParams } = new URL(request.url)
    const uploadId = searchParams.get('id')

    if (!uploadId) {
      return NextResponse.json({ error: 'ID do upload necessário' }, { status: 400 })
    }

    const db = getFirestore()
    const uploadDoc = await db.collection('uploads').doc(uploadId).get()

    if (!uploadDoc.exists) {
      return NextResponse.json({ error: 'Upload não encontrado' }, { status: 404 })
    }

    const uploadData = uploadDoc.data()
    if (uploadData?.userId !== userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // Deletar do Firestore
    await db.collection('uploads').doc(uploadId).delete()

    // Opcional: Deletar do Storage também
    try {
      const storage = getStorage()
      const bucket = storage.bucket()
      const filePath = `${uploadData.folder}/${uploadData.name}`
      await bucket.file(filePath).delete()
    } catch (storageError) {
      console.log('Aviso: Não foi possível deletar do Storage:', storageError)
      // Não falhar a operação se não conseguir deletar do Storage
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao deletar upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}
