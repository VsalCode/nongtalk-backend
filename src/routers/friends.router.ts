import { Router } from "express"
const router = Router()
import { verifyToken } from "../middlewares/auth.middleware"
import { addFriends } from "../controllers/friends.controller"

router.post("", verifyToken, addFriends )

export default router