import type { EmailOptions } from "../email-service"

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>
}
