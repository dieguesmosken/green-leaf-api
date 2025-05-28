# 🔥 Firebase Setup - Green Leaf API

Este documento explica como usar o Firebase no projeto Green Leaf API.

## ✅ Status da Configuração

- ✅ Firebase CLI instalado e funcionando
- ✅ Projeto `greenleafaxis` configurado
- ✅ Regras do Firestore deployadas
- ✅ Configuração dual (MongoDB + Firebase)
- ✅ Context providers configurados
- ✅ Hooks personalizados criados
- ✅ Utilitários de migração implementados
- ✅ Página de demonstração criada

## 🚀 Como usar

### 1. Escolher Sistema de Autenticação

Edite o arquivo `.env`:

```bash
# Para usar Firebase Auth
NEXT_PUBLIC_USE_FIREBASE_AUTH=true

# Para usar MongoDB Auth (padrão)
NEXT_PUBLIC_USE_FIREBASE_AUTH=false
```

### 2. Comandos Disponíveis

```bash
# Firebase
npm run firebase:login        # Fazer login no Firebase
npm run firebase:deploy       # Deploy das regras e configurações
npm run firebase:emulators    # Iniciar emuladores para desenvolvimento
npm run firebase:test         # Testar conexão Firebase

# Migração de dados
npm run migration:users       # Migrar usuários MongoDB → Firebase
npm run migration:data        # Migrar dados específicos
npm run migration:backup      # Backup Firebase → MongoDB
```

### 3. Usando Firebase Auth no Código

```tsx
import { useAuth } from '@/context/firebase-auth-context'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()
  
  if (isLoading) return <div>Carregando...</div>
  
  return (
    <div>
      {user ? (
        <div>
          <p>Olá, {user.name}!</p>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <button onClick={() => login(email, password)}>
          Entrar
        </button>
      )}
    </div>
  )
}
```

### 4. Protegendo Rotas

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>Conteúdo protegido</div>
    </AuthGuard>
  )
}
```

### 5. Upload de Arquivos para Firebase Storage

```tsx
import { uploadUserAvatar } from '@/lib/firebase-utils'

async function handleUpload(file: File) {
  try {
    const url = await uploadUserAvatar(user.id, file)
    console.log('Upload concluído:', url)
  } catch (error) {
    console.error('Erro no upload:', error)
  }
}
```

### 6. Hooks Personalizados

#### useFirebaseStorage
Para uploads e downloads de arquivos:

```tsx
import { useFirebaseStorage } from '@/hooks/use-firebase'

function UploadComponent() {
  const { uploadFile, deleteFile, isUploading, uploadProgress } = useFirebaseStorage()
  
  const handleUpload = async (file: File) => {
    const url = await uploadFile(file, 'uploads/')
    console.log('Arquivo enviado:', url)
  }
}
```

#### useFirebaseUser
Para gerenciar dados do usuário:

```tsx
import { useFirebaseUser } from '@/hooks/use-firebase'

function ProfileComponent() {
  const { userData, updateUser, isLoading } = useFirebaseUser()
  
  const handleUpdate = async () => {
    await updateUser({ name: 'Novo Nome' })
  }
}
```

#### useFirebaseCollection
Para gerenciar coleções do Firestore:

```tsx
import { useFirebaseCollection } from '@/hooks/use-firebase'

function HeatmapsComponent() {
  const { data, addDocument, updateDocument, deleteDocument } = useFirebaseCollection('heatmaps')
}
```

### 7. Página de Demonstração

Acesse `/firebase-demo` para testar todas as funcionalidades:

- Upload de arquivos para Storage
- Gerenciamento de dados do usuário
- CRUD em coleções do Firestore
- Progresso de upload em tempo real

### 8. Migração de Dados

#### Migrar usuários do MongoDB para Firebase:
```bash
npm run migration:users
```

#### Migrar coleção específica:
```bash
npm run migration:data heatmaps
npm run migration:data analyses
```

#### Fazer backup do Firebase:
```bash
npm run migration:backup
```

## 📁 Estrutura de Arquivos

```
lib/
├── firebase.ts              # Configuração base do Firebase
├── firebase-utils.ts        # Funções utilitárias
└── firebase-test.ts         # Testes de conexão

context/
├── auth-context.tsx         # Context MongoDB (original)
└── firebase-auth-context.tsx # Context Firebase (novo)

components/auth/
└── auth-guard.tsx           # Proteção de rotas

app/
└── providers.tsx            # Provider dual configurado
```

## 🔧 Configuração dos Serviços Firebase

### Firestore (Database)
- Regras de segurança configuradas
- Índices automáticos configurados
- Collections: `users`, `analyses`, `images`, `heatmaps`

### Storage (Arquivos)
- Upload de avatars: `avatars/{userId}/`
- Upload de análises: `analyses/{userId}/`
- Arquivos públicos: `public/`

### Auth (Autenticação)
- Email/senha
- Gerenciamento de perfis
- Reset de senha

## 🛡️ Segurança

- Regras do Firestore permitem acesso apenas aos próprios dados
- Storage protegido por autenticação
- Validação client-side e server-side

## 🧪 Testando

Execute os testes:

```bash
node test-firebase-cli.js  # Testa CLI
npm run firebase:test     # Testa conexão
```

## 📚 Links Úteis

- [Console Firebase](https://console.firebase.google.com/project/greenleafaxis)
- [Documentação Firebase](https://firebase.google.com/docs)
- [Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)

---

**Nota**: O sistema está configurado para funcionar tanto com MongoDB quanto com Firebase. Mude a variável `NEXT_PUBLIC_USE_FIREBASE_AUTH` para alternar entre os sistemas.
