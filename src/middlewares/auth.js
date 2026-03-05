import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "Acesso negado" })
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET)

    req.userId = decoded.id
  } catch (error) {
    return res.status(401).json({ message: "Token Inválido" })
  }

  next()
}
export default auth
