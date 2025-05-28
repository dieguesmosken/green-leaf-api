// Test script for password reset functionality
const testEmail = "dmosken2015@gmail.com";

async function testPasswordReset() {
  try {
    console.log("🔄 Testando envio de email de reset de senha...");
    
    const response = await fetch("http://localhost:3002/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail
      }),
    });

    const data = await response.json();
    
    console.log("📊 Status da resposta:", response.status);
    console.log("📋 Dados da resposta:", data);
    
    if (response.ok) {
      console.log("✅ Email de reset enviado com sucesso!");
      console.log("📧 Verifique a caixa de entrada do email:", testEmail);
      if (data.resetLink) {
        console.log("🔗 Link de reset (apenas para teste):", data.resetLink);
      }
    } else {
      console.log("❌ Erro ao enviar email de reset:", data.error);
    }
  } catch (error) {
    console.error("💥 Erro na requisição:", error);
  }
}

// Execute o teste
testPasswordReset();
