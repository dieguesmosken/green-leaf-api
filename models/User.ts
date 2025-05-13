import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser {
  name: string
  email: string
  password: string
  role: "admin" | "researcher" | "farmer"
  location?: {
    type: string
    coordinates: number[]
  }
  createdAt: Date
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>
}

export interface IUserDocument extends mongoose.Document, IUser {
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "researcher", "farmer"],
    default: "farmer",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for geospatial queries
userSchema.index({ location: "2dsphere" })

// Hash password before saving
userSchema.pre("save", async function (next) {
  

  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email: string, password: string) {
  const user = await this.findOne({ email })

  if (!user) {
    throw new Error("Invalid login credentials")
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    throw new Error("Invalid login credentials")
  }

  return user
}

// Create or retrieve the model
const User = mongoose.models.User || mongoose.model<IUserDocument, IUserModel>("User", userSchema)

export default User
