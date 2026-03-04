import express from "express"
import { createUser, userLogin } from "../controllers/userController.js"

const router = express.Router()


// Cadastro e Login separados
router.post("/cadastro", createUser)

router.use("/login", userLogin)

export default router
