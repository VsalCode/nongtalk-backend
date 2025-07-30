import { Router } from "express"
import authRouter from "./auth.router"
import friendsRouter from "./friends.router"
const router = Router()

router.use("/auth", authRouter)
router.use("/friends", friendsRouter)

export default router