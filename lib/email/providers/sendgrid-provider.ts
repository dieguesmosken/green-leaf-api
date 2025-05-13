import sgMail from "@sendgrid/mail"
import type { EmailProvider } from "./email-provider"
import type { EmailOptions } from "../email-service"

export class SendGridProvider implements EmailProvider {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY environment variable is not set")
    }
    sgMail.setApiKey(apiKey)
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await sgMail.send({
        to: options.to,
        from: options.from!,
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      })
      console.log(`Email sent to ${options.to} via SendGrid`)
    } catch (error) {
      console.error("SendGrid error:", error)
      throw error
    }
  }
}
