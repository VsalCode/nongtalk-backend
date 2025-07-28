import { Router } from "express"
import { Login, register } from "../controllers/auth.controller"
const router  = Router()

router.post("/register", register)
router.post("/login", Login)

export default router