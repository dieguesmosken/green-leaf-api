import type { EmailProvider } from "./providers/email-provider"
import { SendGridProvider } from "./providers/sendgrid-provider"
import { MailgunProvider } from "./providers/mailgun-provider"
import { ConsoleProvider } from "./providers/console-provider"

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html: string
  from?: string
}

export class EmailService {
  private provider: EmailProvider

  constructor(providerName?: string) {
    // Determine which provider to use based on environment variables
    if (!providerName) {
      if (process.env.SENDGRID_API_KEY) {
        providerName = "sendgrid"
      } else if (process.env.MAILGUN_API_KEY) {
        providerName = "mailgun"
      } else {
        providerName = "console"
      }
    }

    // Initialize the selected provider
    switch (providerName.toLowerCase()) {
      case "sendgrid":
        this.provider = new SendGridProvider()
        break
      case "mailgun":
        this.provider = new MailgunProvider()
        break
      default:
        this.provider = new ConsoleProvider()
        break
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Set default from address if not provided
      if (!options.from) {
        options.from = process.env.EMAIL_FROM || "noreply@greenleaf.com"
      }

      // Send the email using the selected provider
      await this.provider.send(options)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<boolean> {
    const subject = "Redefinição de Senha - Green Leaf"

    // Create HTML content using the template
    const html = this.getPasswordResetTemplate(name, resetLink)

    // Create plain text version as fallback
    const text = `
      Olá ${name},

      Recebemos uma solicitação para redefinir a senha da sua conta Green Leaf.

      Para redefinir sua senha, clique no link abaixo:
      ${resetLink}

      Este link expirará em 1 hora.

      Se você não solicitou a redefinição de senha, por favor ignore este email.

      Atenciosamente,
      Equipe Green Leaf
    `

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    })
  }

  // Atualize o template de email para português
  private getPasswordResetTemplate(name: string, resetLink: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinição de Senha</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .logo {
          color: #22c55e;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #22c55e;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: 500;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          color: #666;
          font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Green Leaf</div>
        </div>
        <div class="content">
          <h2>Olá ${name},</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta Green Leaf.</p>
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Redefinir Senha</a>
          </div>
          <p>Ou copie e cole o seguinte link no seu navegador:</p>
          <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
          <p>Este link expirará em 1 hora.</p>
          <p>Se você não solicitou a redefinição de senha, por favor ignore este email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Green Leaf. Todos os direitos reservados.</p>
          <p>Este é um email automático, por favor não responda.</p>
          <p>Criado por Axis - Fatec Registro 2025</p>
        </div>
      </div>
    </body>
    </html>
    `
  }
}

// Export a singleton instance for use throughout the application
export const emailService = new EmailService()

// Export helper functions for common email tasks
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<boolean> {
  return emailService.sendPasswordResetEmail(email, name, resetLink)
}
