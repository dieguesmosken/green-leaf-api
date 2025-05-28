import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UploadProvider } from "@/context/upload-context"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UploadProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <MobileNav />
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="hidden text-xl font-bold md:inline-block">Green Leaf</span>
              </Link>
            </div>
            <UserNav />
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col gap-2 p-4">
              <DashboardNav />
            </div>
          </aside>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <Footer />
      </div>
    </UploadProvider>
  )
}
