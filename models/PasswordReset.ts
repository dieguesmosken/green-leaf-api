import mongoose from "mongoose"

export interface IPasswordReset {
  userId: mongoose.Types.ObjectId
  token: string
  expires: Date
  used: boolean
}

export interface IPasswordResetDocument extends mongoose.Document, IPasswordReset {}

const passwordResetSchema = new mongoose.Schema<IPasswordResetDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000), // 1 hour from now
  },
  used: {
    type: Boolean,
    default: false,
  },
})

// Create or retrieve the model
const PasswordReset =
  mongoose.models.PasswordReset || mongoose.model<IPasswordResetDocument>("PasswordReset", passwordResetSchema)

export default PasswordReset
