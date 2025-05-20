import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/settings/account-form"
import { ProfileForm } from "@/components/settings/profile-form"
import { NotificationsForm } from "@/components/settings/notifications-form"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences" />
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Perfil</h3>
          <p className="text-sm text-muted-foreground">Atualize suas informações pessoais e configurações de perfil.</p>
        </div>
        <Separator />
        <ProfileForm />
        <div>
          <h3 className="text-lg font-medium">Conta</h3>
          <p className="text-sm text-muted-foreground">Atualize as configurações da sua conta e altere sua senha.</p>
        </div>
        <Separator />
        <AccountForm />
        <div>
          <h3 className="text-lg font-medium">Notificações</h3>
          <p className="text-sm text-muted-foreground">Configure como você recebe notificações e alertas.</p>
        </div>
        <Separator />
        <NotificationsForm />
      </div>
    </DashboardShell>
  )
}
