import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decodedToken.id
    req.userRole = decodedToken.role

    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

export default auth
