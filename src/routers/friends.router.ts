import { Router } from "express"
const router = Router()
import { verifyToken } from "../middlewares/auth.middleware"
import { addFriend, getAllFriends, deleteFriendById } from "../controllers/friends.controller"

router.post("", verifyToken, addFriend )
router.get("", verifyToken, getAllFriends )
router.delete("/:id", verifyToken, deleteFriendById)

export default router