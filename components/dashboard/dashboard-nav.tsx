"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, FileUp, Home, MapPin, Settings, Users, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Atualize os itens de navegação
const navItems = [
  {
    title: "Painel",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "researcher", "farmer"],
  },
  {
    title: "Mapa de Calor",
    href: "/dashboard/heatmap",
    icon: MapPin,
    roles: ["admin", "researcher", "farmer"],
  },
  {
    title: "Uploads",
    href: "/dashboard/uploads",
    icon: FileUp,
    roles: ["admin", "researcher", "farmer"],
  },
  {
    title: "Análises",
    href: "/dashboard/analysis",
    icon: BarChart3,
    roles: ["admin", "researcher", "farmer"],
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Teste de Email",
    href: "/admin/email-test",
    icon: Mail,
    roles: ["admin"],
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "researcher", "farmer"],
  },
  {
    href: "/equipe",
    title: "Equipe",
    icon: Users,
    roles: ["admin", "researcher", "farmer"],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="grid items-start gap-2">
      {navItems
        .filter((item) => item.roles.includes(user?.role || "farmer"))
        .map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
    </nav>
  )
}
