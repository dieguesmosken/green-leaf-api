// This is a mock email service for demonstration purposes
// In a real application, you would use a service like SendGrid, Mailgun, etc.

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<void> {
  // In a real application, you would send an actual email here
  console.log(`
    Sending password reset email to: ${email}
    Name: ${name}
    Reset Link: ${resetLink}
    
    Email content:
    Subject: Reset Your Green Leaf Password
    
    Hello ${name},
    
    We received a request to reset your password for your Green Leaf account.
    
    To reset your password, click on the link below:
    ${resetLink}
    
    This link will expire in 1 hour.
    
    If you did not request a password reset, please ignore this email.
    
    Best regards,
    The Green Leaf Team
  `)

  // Simulate a delay to mimic sending an email
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve()
}
