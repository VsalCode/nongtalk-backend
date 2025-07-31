import { Router } from "express";
import { getUserProfile, updateUsername } from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const router = Router()

router.get("", verifyToken, getUserProfile)
router.patch("", verifyToken, updateUsername)

export default router