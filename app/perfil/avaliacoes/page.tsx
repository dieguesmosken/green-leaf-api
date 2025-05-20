"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { getUserReviews } from "@/lib/reviews"
import type { Review } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, ChevronLeft } from "lucide-react"

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !isLoading) {
      router.push("/login?redirect=/perfil/avaliacoes")
      return
    }

    const loadReviews = async () => {
      if (!user) return

      try {
        const data = await getUserReviews(user.id)
        setReviews(data)
      } catch (error) {
        console.error("Failed to load user reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [user, router, isLoading])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/perfil">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar para o Perfil
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Minhas Avaliações</h1>
            <p className="text-muted-foreground mt-2">
              Veja todas as avaliações que você deixou para produtos da Runa Verde.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">Você ainda não avaliou nenhum produto.</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/produtos">Explorar Produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Link href={`/produtos/${review.productId}`} className="font-medium hover:underline">
                          Produto: {review.productId}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="md" />
                          <span className="text-sm">({review.rating} de 5 estrelas)</span>
                        </div>

                        {review.title && <p className="font-medium mt-2">{review.title}</p>}
                        <p className="text-muted-foreground mt-1">{review.comment}</p>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/produtos/${review.productId}`}>Ver Produto</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
