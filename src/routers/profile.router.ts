import { Router } from "express";
import { getUserProfile } from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const router = Router()

router.get("", verifyToken, getUserProfile)

export default router