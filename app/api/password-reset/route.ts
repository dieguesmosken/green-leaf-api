import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    console.log("Password reset requested for:", email);

    // Note: Firebase Auth password reset is handled client-side
    // This endpoint confirms the request was received
    return NextResponse.json({
      success: true,
      message: "Se seu email estiver registrado, você receberá um link para redefinir sua senha.",
      email: email,
    });
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error);
    
    return NextResponse.json({ 
      error: "Erro interno do servidor. Tente novamente mais tarde." 
    }, { status: 500 });
  }
}
