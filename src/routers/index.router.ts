import { Router } from "express"
import authRouter from "./auth.router"
import friendsRouter from "./friends.router"
import profileRouter from "./profile.router"
const router = Router()

router.use("/auth", authRouter)
router.use("/friends", friendsRouter)
router.use("/profile", profileRouter)

export default router