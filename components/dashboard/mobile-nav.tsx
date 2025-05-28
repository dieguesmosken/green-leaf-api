"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, FileUp, Home, Leaf, MapPin, Menu, Settings, Users } from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"

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
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "researcher", "farmer"],
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Alternar menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span>Green Leaf</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="grid gap-2 py-6">
          {navItems
            .filter((item) => item.roles.includes(user?.role || "farmer"))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
