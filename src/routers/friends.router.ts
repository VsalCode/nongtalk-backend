import { Router } from "express"
const router = Router()
import { verifyToken } from "../middlewares/auth.middleware"
import { addFriend, getAllFriends } from "../controllers/friends.controller"

router.post("", verifyToken, addFriend )
router.get("", verifyToken, getAllFriends )

export default router