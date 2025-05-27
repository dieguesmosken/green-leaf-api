// Test final do login no servidor em execução
const https = require('http');

const data = JSON.stringify({
  email: 'dmosken2015@gmail.com',
  password: '123456'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🧪 Testando login na API...');
console.log('📧 Email: dmosken2015@gmail.com');
console.log('🔑 Senha: 123456');
console.log('');

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('');
    console.log('📝 Response Body:');
    try {
      const parsed = JSON.parse(responseBody);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 200 && parsed.success) {
        console.log('');
        console.log('✅ LOGIN FUNCIONANDO PERFEITAMENTE!');
        console.log(`👤 Usuário autenticado: ${parsed.user.name}`);
        console.log(`📧 Email: ${parsed.user.email}`);
        console.log(`🎭 Role: ${parsed.user.role}`);
      } else {
        console.log('');
        console.log('❌ FALHA NO LOGIN');
      }
    } catch (e) {
      console.log('Raw response:', responseBody);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
});

req.write(data);
req.end();
