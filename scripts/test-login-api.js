import fetch from 'node-fetch';

async function testLoginAPI() {
  try {
    console.log('🧪 Testando login via API...');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'dmosken2015@gmail.com',
        password: '123456'
      })
    });
    
    console.log(`📊 Status: ${response.status}`);
    
    const data = await response.json();
    console.log('📋 Resposta:', JSON.stringify(data, null, 2));
    
    // Verificar se há cookies
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      console.log('🍪 Cookies definidos:', cookies);
    } else {
      console.log('❌ Nenhum cookie foi definido');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLoginAPI();
