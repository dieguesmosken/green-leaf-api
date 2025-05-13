import type { EmailProvider } from "./email-provider"
import type { EmailOptions } from "../email-service"

export class ConsoleProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    console.log("========== EMAIL CONSOLE PROVIDER ==========")
    console.log(`To: ${options.to}`)
    console.log(`From: ${options.from}`)
    console.log(`Subject: ${options.subject}`)
    console.log("Text:")
    console.log(options.text || "(No text content)")
    console.log("HTML:")
    console.log(options.html)
    console.log("===========================================")

    // Simulate a delay to mimic sending an email
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}
