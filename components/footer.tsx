import { Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:py-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Green Leaf. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline">
            Termos
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacidade
          </Link>
          <Link href="/contact" className="hover:underline">
            Contato
          </Link>
        </div>
        <div className="text-sm text-muted-foreground font-medium">Criado por Axis - Fatec Registro 2025</div>
      </div>
    </footer>
  )
}
