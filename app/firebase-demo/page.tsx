import FirebaseDemo from '@/components/firebase-demo'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function FirebaseDemoPage() {
  return (
    <AuthGuard>
      <FirebaseDemo />
    </AuthGuard>
  )
}
