// Test password reset com email e senha temporária
console.log("🔄 Testando reset de senha para o usuário existente...");

// Primeiro, tentativa de login com senha atual
async function testCurrentLogin() {
  try {
    console.log("📧 Testando login com o usuário: dmosken2015@gmail.com");
    
    const response = await fetch("http://localhost:3002/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "dmosken2015@gmail.com",
        password: "123456" // senha comum de teste
      }),
    });

    const data = await response.json();
    
    console.log("📊 Status do login:", response.status);
    console.log("📋 Resposta do login:", data);
    
    if (response.ok) {
      console.log("✅ Login funcionou! Senha atual: 123456");
      return true;
    } else {
      console.log("❌ Login falhou - precisa de reset de senha");
      console.log("🔧 Próximo passo: usar a funcionalidade de reset na UI");
      return false;
    }
  } catch (error) {
    console.error("💥 Erro no teste de login:", error);
    return false;
  }
}

// Testar diferentes senhas comuns
async function testCommonPasswords() {
  const commonPasswords = ["123456", "password", "admin", "greenleaf", "123", "test"];
  
  for (const password of commonPasswords) {
    try {
      console.log(`🔍 Testando senha: ${password}`);
      
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "dmosken2015@gmail.com",
          password: password
        }),
      });

      if (response.ok) {
        console.log(`✅ SENHA ENCONTRADA: ${password}`);
        return password;
      } else {
        console.log(`❌ Senha ${password} não funciona`);
      }
    } catch (error) {
      console.log(`💥 Erro testando senha ${password}:`, error.message);
    }
  }
  
  console.log("🚫 Nenhuma senha comum funcionou");
  return null;
}

// Executar testes
async function runTests() {
  console.log("🚀 Iniciando testes de autenticação...");
  
  const loginSuccess = await testCurrentLogin();
  
  if (!loginSuccess) {
    console.log("🔄 Testando senhas comuns...");
    const foundPassword = await testCommonPasswords();
    
    if (!foundPassword) {
      console.log("📧 Recomendação: Use a funcionalidade de reset de senha na UI");
      console.log("🌐 Acesse: http://localhost:3002/forgot-password");
      console.log("📩 Use o email: dmosken2015@gmail.com");
    }
  }
}

runTests();
