import User from "../models/User.js"
import crypto from "node:crypto"
import cryptPassword from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

// Cadastro
export const createUser = async (req, res) => {
  try {
    const userData = req.body

    const salt = await cryptPassword.genSalt(10)
    const hashPassword = await cryptPassword.hash(userData.password, salt)

    const userToCreate = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: hashPassword,
    }
    const user = await User.create(userToCreate)

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Encontrar todos os usuários
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({attributes: {exclude: ['id', 'createdAt', 'updatedAt']}})
    res.status(200).json(users)
  } catch (error) {
    console.error("Erro: ", error)
    res.status(500).json({ message: "Erro ", error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  const user = await User.destroy({
    where: { id: req.params.id },
  })
  res.status(200).json({ message: "Deu bom" })
}

export const userLogin = async (req, res) => {
  try {
    const userInfo = req.body

    const user = await User.findOne({ where: { email: userInfo.email } })

    //Verifica se o usuário existe no banco
    if (!user) {
      return res.status(404).json({ message: "Não encontrado" })
    }

    const isMatch = await cryptPassword.compare(
      userInfo.password,
      user.password,
    )

    //Verifica se a senha confere com o banco
    if (!isMatch) {
      return res.status(400).json({ message: "Senha Inválida" })
    }

    //Gerar Token JWT
    const token = jwt.sign(
      { id: user.id },
      SECRET,
      // tempo para deslogar, caso o app fique parado
      { expiresIn: "1h" },
    )

    res.status(200).json({ user, token })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ message: "Erro no servidor", error: error.message })
  }
}
