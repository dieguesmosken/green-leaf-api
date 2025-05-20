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
        <div className="text-sm text-muted-foreground font-medium">Criado por Axis</div>
        {/* <div className="flex items-center gap-2">
          <Link href="/github" className="text-muted-foreground hover:text-primary">
            GitHub
          </Link>
          <Link href="/linkedin" className="text-muted-foreground hover:text-primary">
            LinkedIn
          </Link>
          <Link href="/twitter" className="text-muted-foreground hover:text-primary">
            Twitter
          </Link>

        </div> */}
        {/* imagem do logo fatec registro https://i.imgur.com/5wISpp8.png */}
        <div className="flex items-center gap-2">
          <Link href="https://fatecregistro.cps.sp.gov.br/" target="_blank" rel="noopener noreferrer">
            <img
              src="https://i.imgur.com/5wISpp8.png"
              alt="Logo da Fatec Registro" 
              className="h-16" 
            />
          </Link>
          {/* colorida https://i.imgur.com/td1jhPY.png */}
          </div>
      </div>
    </footer>
  )
}
