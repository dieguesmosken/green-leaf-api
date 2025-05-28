/**
 * Script para testar o sistema de upload com fallbacks
 */

// Simular um arquivo de imagem para teste
function createTestImageFile() {
  // Criar um canvas pequeno com uma imagem de teste
  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado')
  
  // Desenhar uma imagem simples
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(0, 0, 100, 100)
  ctx.fillStyle = '#fff'
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('TEST', 50, 55)
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'test-image.png', { type: 'image/png' })
        resolve(file)
      }
    }, 'image/png')
  })
}

async function testMultiUpload() {
  console.log('🧪 Iniciando teste do sistema de upload com fallbacks...')
  
  try {
    // Importar o sistema de upload
    const { uploader } = await import('/lib/multi-upload.js')
    
    // Verificar status dos provedores
    console.log('📊 Verificando status dos provedores...')
    const providerStatus = await uploader.getProviderStatus()
    console.table(providerStatus)
    
    // Criar arquivo de teste
    console.log('🖼️ Criando arquivo de teste...')
    const testFile = await createTestImageFile()
    console.log(`Arquivo criado: ${testFile.name} (${testFile.size} bytes)`)
    
    // Tentar upload
    console.log('⬆️ Iniciando upload...')
    const result = await uploader.upload(testFile)
    
    if (result.success) {
      console.log('✅ Upload bem-sucedido!')
      console.log(`Provider usado: ${result.provider}`)
      console.log(`URL: ${result.url}`)
      console.log(`É temporário: ${result.isTemporary || false}`)
      
      if (result.isTemporary) {
        console.log('⚠️ Upload temporário - verificando localStorage...')
        const keys = Object.keys(localStorage).filter(k => k.startsWith('image_'))
        console.log(`Imagens no localStorage: ${keys.length}`)
      }
    } else {
      console.log('❌ Upload falhou!')
      console.log(`Erro: ${result.error}`)
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error)
  }
}

// Função para simular indisponibilidade do Imgur
async function testImgurFailure() {
  console.log('🚫 Testando falha do Imgur...')
  
  // Simular erro 503 (service unavailable)
  const originalFetch = window.fetch
  window.fetch = (url, options) => {
    if (typeof url === 'string' && url.includes('imgur.com')) {
      return Promise.resolve(new Response(
        JSON.stringify({ 
          data: { error: 'Imgur is temporarily over capacity. Please try again later.' }
        }),
        { status: 503 }
      ))
    }
    return originalFetch(url, options)
  }
  
  try {
    await testMultiUpload()
  } finally {
    // Restaurar fetch original
    window.fetch = originalFetch
  }
}

// Função para teste completo
async function runCompleteTest() {
  console.log('🔄 TESTE COMPLETO DO SISTEMA DE FALLBACK')
  console.log('=====================================')
  
  console.log('\n1️⃣ Teste normal (todos os provedores disponíveis):')
  await testMultiUpload()
  
  console.log('\n2️⃣ Teste com falha do Imgur:')
  await testImgurFailure()
  
  console.log('\n✅ Testes concluídos!')
}

// Exportar funções para uso no console
if (typeof window !== 'undefined') {
  window.testUploadSystem = {
    testMultiUpload,
    testImgurFailure,
    runCompleteTest,
    createTestImageFile
  }
  
  console.log('🛠️ Sistema de teste carregado!')
  console.log('Use window.testUploadSystem.runCompleteTest() para executar todos os testes')
}

export { testMultiUpload, testImgurFailure, runCompleteTest, createTestImageFile }
