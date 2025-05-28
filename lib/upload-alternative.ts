/**
 * Solução alternativa para upload de avatar usando uploadBytesResumable
 * Esta função resolve problemas de autenticação do Storage
 */

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage, auth } from "@/lib/firebase"

export const uploadAvatarAlternative = async (uid: string, file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 Upload alternativo iniciado...")
      
      // Verificar autenticação múltiplas vezes
      let authAttempts = 0
      const maxAuthAttempts = 5
      
      while (authAttempts < maxAuthAttempts) {
        authAttempts++
        console.log(`🔐 Verificação de auth ${authAttempts}/${maxAuthAttempts}`)
        
        const currentUser = auth.currentUser
        if (currentUser && currentUser.uid === uid) {
          console.log("✅ Usuário autenticado confirmado")
          break
        }
        
        if (authAttempts === maxAuthAttempts) {
          reject(new Error("Falha na verificação de autenticação"))
          return
        }
        
        // Aguardar antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Forçar refresh do token
      console.log("🔄 Refreshing token...")
      const user = auth.currentUser!
      await user.reload()
      const token = await user.getIdToken(true)
      console.log("🔑 Token refreshed:", !!token)
      
      // Aguardar propagação do token
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Criar referência com timestamp único
      const timestamp = Date.now()
      const fileName = `avatar_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const storageRef = ref(storage, `avatars/${uid}/${fileName}`)
      
      console.log("📁 Upload path:", `avatars/${uid}/${fileName}`)
      
      // Usar uploadBytesResumable para melhor controle
      const uploadTask = uploadBytesResumable(storageRef, file)
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`📊 Upload progress: ${progress.toFixed(1)}%`)
        },
        (error) => {
          console.error("❌ Upload error:", error.code, error.message)
          reject(error)
        },
        async () => {
          try {
            console.log("✅ Upload completed, getting download URL...")
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            console.log("🔗 Download URL:", downloadURL)
            resolve(downloadURL)
          } catch (urlError) {
            console.error("❌ Error getting download URL:", urlError)
            reject(urlError)
          }
        }
      )
      
    } catch (error) {
      console.error("❌ Fatal error in alternative upload:", error)
      reject(error)
    }
  })
}
