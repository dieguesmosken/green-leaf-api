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
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">Update your personal information and profile settings.</p>
        </div>
        <Separator />
        <ProfileForm />
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">Update your account settings and change your password.</p>
        </div>
        <Separator />
        <AccountForm />
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">Configure how you receive notifications and alerts.</p>
        </div>
        <Separator />
        <NotificationsForm />
      </div>
    </DashboardShell>
  )
}
