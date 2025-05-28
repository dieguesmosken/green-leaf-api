import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Routes
import userRoutes from "./routes/users.js"
import imageRoutes from "./routes/images.js"
import analysisRoutes from "./routes/analyses.js"
import heatmapRoutes from "./routes/heatmaps.js"

// Config
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(cors())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/images", imageRoutes)
app.use("/api/analyses", analysisRoutes)
app.use("/api/heatmaps", heatmapRoutes)

// Health check route
app.get("/", (req, res) => {
  res.send("Green Leaf API is running")
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  })
  .catch((error) => console.log(`${error} did not connect`))
