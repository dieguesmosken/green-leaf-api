import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Green Leaf</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Green Leaf</h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                Empowering farmers and researchers to combat bacterial infections in cassava plants
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Green Leaf is dedicated to improving food security by providing advanced tools for the early detection
                and management of Xanthomonas phaseoli infections in cassava crops. Our AI-powered platform helps
                farmers and researchers identify, track, and respond to bacterial infections, reducing crop losses and
                improving yields.
              </p>

              <h2 className="text-2xl font-bold">The Problem</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Cassava is a staple food for over 800 million people worldwide, particularly in developing regions.
                Bacterial infections caused by Xanthomonas phaseoli can devastate cassava crops, leading to significant
                food shortages and economic losses. Early detection and management of these infections are crucial but
                often challenging due to limited resources and expertise.
              </p>

              <h2 className="text-2xl font-bold">Our Solution</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Green Leaf combines deep learning technology with geospatial mapping to provide a comprehensive solution
                for bacterial infection management. Our platform allows users to:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>Upload and analyze images of cassava leaves for infection detection</li>
                <li>Visualize infection distribution through interactive heatmaps</li>
                <li>Track infection patterns over time and across regions</li>
                <li>Receive early warnings and recommendations for infection management</li>
                <li>Collaborate with researchers and other farmers to share knowledge and resources</li>
              </ul>

              <h2 className="text-2xl font-bold">Our Team</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Green Leaf was founded by a team of agricultural scientists, AI specialists, and software engineers
                committed to applying technology to solve critical food security challenges. Our diverse team brings
                together expertise in plant pathology, machine learning, and user-centered design to create a platform
                that is both powerful and accessible.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2023 Green Leaf. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
