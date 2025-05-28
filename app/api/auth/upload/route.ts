// app/api/upload-avatar/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    })
    const data = await res.json()
    if (!res.ok || !data?.data?.link) {
      return NextResponse.json({ error: "Erro ao enviar imagem para o Imgur", details: data }, { status: 500 })
    }
    return NextResponse.json({ url: data.data.link })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro desconhecido" }, { status: 500 })
  }
}
