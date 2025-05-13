import formData from "form-data"
import Mailgun from "mailgun.js"
import type { EmailProvider } from "./email-provider"
import type { EmailOptions } from "../email-service"

export class MailgunProvider implements EmailProvider {
  private mailgun: any

  constructor() {
    const apiKey = process.env.MAILGUN_API_KEY
    const domain = process.env.MAILGUN_DOMAIN

    if (!apiKey) {
      throw new Error("MAILGUN_API_KEY environment variable is not set")
    }

    if (!domain) {
      throw new Error("MAILGUN_DOMAIN environment variable is not set")
    }

    const mailgun = new Mailgun(formData)
    this.mailgun = mailgun.client({ username: "api", key: apiKey })
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      const domain = process.env.MAILGUN_DOMAIN!

      await this.mailgun.messages.create(domain, {
        from: options.from!,
        to: options.to,
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      })

      console.log(`Email sent to ${options.to} via Mailgun`)
    } catch (error) {
      console.error("Mailgun error:", error)
      throw error
    }
  }
}
