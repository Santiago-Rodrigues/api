import express, { Router } from "express"
import {
  deleteUser,
  getAllUsers,
} from "../controllers/userController.js"

const router = express.Router()

router.get("/todos", getAllUsers)
router.delete("/deletar/:id", deleteUser)


export default router
