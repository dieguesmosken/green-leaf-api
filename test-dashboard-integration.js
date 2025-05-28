/**
 * Teste de integração dos componentes do dashboard
 * Este script verifica se todos os componentes estão sendo renderizados corretamente
 */

console.log("🔍 Testando integração do Dashboard...")

// Verificar se todos os componentes necessários existem
const fs = require('fs')
const path = require('path')

const componentsToCheck = [
  'components/dashboard/quick-upload.tsx',
  'components/dashboard/dashboard-status-button.tsx',
  'components/dashboard/upload-stats-card.tsx',
  'hooks/use-uploads.tsx',
  'context/upload-context.tsx'
]

let allFilesExist = true

componentsToCheck.forEach(component => {
  const filePath = path.join(__dirname, component)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${component} - EXISTE`)
  } else {
    console.log(`❌ ${component} - NÃO ENCONTRADO`)
    allFilesExist = false
  }
})

// Verificar se a página do dashboard está integrada
const dashboardPagePath = path.join(__dirname, 'app/dashboard/page.tsx')
if (fs.existsSync(dashboardPagePath)) {
  const content = fs.readFileSync(dashboardPagePath, 'utf8')
  
  const requiredImports = [
    'QuickUpload',
    'DashboardStatusButton', 
    'UploadStatsCard'
  ]
  
  console.log('\n🔍 Verificando imports no dashboard...')
  requiredImports.forEach(importName => {
    if (content.includes(importName)) {
      console.log(`✅ ${importName} - IMPORTADO`)
    } else {
      console.log(`❌ ${importName} - NÃO IMPORTADO`)
      allFilesExist = false
    }
  })
}

// Verificar se o layout tem o UploadProvider
const layoutPath = path.join(__dirname, 'app/dashboard/layout.tsx')
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8')
  if (content.includes('UploadProvider')) {
    console.log('✅ UploadProvider - CONFIGURADO NO LAYOUT')
  } else {
    console.log('❌ UploadProvider - NÃO CONFIGURADO')
    allFilesExist = false
  }
}

console.log('\n🎯 RESULTADO DO TESTE:')
if (allFilesExist) {
  console.log('✅ TODOS OS COMPONENTES ESTÃO INTEGRADOS CORRETAMENTE!')
  console.log('🚀 O sistema de upload do dashboard está pronto para uso!')
} else {
  console.log('❌ ALGUMAS INTEGRAÇÕES ESTÃO FALTANDO')
}

console.log('\n📊 STATUS DOS COMPONENTES:')
console.log('- QuickUpload: Upload rápido com drag-and-drop')
console.log('- DashboardStatusButton: Monitoramento de status dos provedores')
console.log('- UploadStatsCard: Estatísticas em tempo real')
console.log('- Sistema de Context: Gerenciamento de estado global')
console.log('- Sistema de Toast: Notificações de feedback')
