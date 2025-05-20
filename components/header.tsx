"use client"

import { Leaf } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user } = useAuth();
  return (
    <header className="border-b bg-muted/40">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold">Green Leaf</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/sobre" className="text-sm text-muted-foreground hover:underline">
            Sobre
          </Link>
          <Link href="/contato" className="text-sm text-muted-foreground hover:underline">
            Contato
          </Link>
          {user ? (
            <UserNav />
          ) : (
            <Link href="/login" className="text-sm text-primary font-medium hover:underline">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}