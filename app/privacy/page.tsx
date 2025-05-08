import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">Last updated: May 8, 2023</p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">1. Introduction</h2>
              <p className="text-gray-500 dark:text-gray-400">
                At Green Leaf, we respect your privacy and are committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>

              <h2 className="text-2xl font-bold">2. Information We Collect</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We collect several types of information from and about users of our platform, including:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>Personal information (such as name, email address, and location)</li>
                <li>Account credentials</li>
                <li>Image data and metadata from uploaded leaf images</li>
                <li>Geolocation data</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>Providing and maintaining our platform</li>
                <li>Analyzing leaf images for bacterial infection detection</li>
                <li>Creating heatmaps and visualizations of infection distribution</li>
                <li>Improving our services and user experience</li>
                <li>Communicating with you about your account and our services</li>
                <li>Ensuring the security of our platform</li>
              </ul>

              <h2 className="text-2xl font-bold">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>With your consent</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>For research purposes (in anonymized or aggregated form)</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>

              <h2 className="text-2xl font-bold">5. Data Security</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We implement appropriate technical and organizational measures to protect your personal information from
                unauthorized access, disclosure, alteration, or destruction.
              </p>

              <h2 className="text-2xl font-bold">6. Your Rights</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
              </ul>

              <h2 className="text-2xl font-bold">7. Changes to This Privacy Policy</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold">8. Contact Us</h2>
              <p className="text-gray-500 dark:text-gray-400">
                If you have any questions about this Privacy Policy, please contact us at privacy@greenleaf.com.
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
