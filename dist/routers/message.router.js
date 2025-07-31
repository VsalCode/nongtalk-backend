import { Router } from "express";
import { messageHistory } from "../controllers/message.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const router = Router();
router.post("", verifyToken, messageHistory);
export default router;
//# sourceMappingURL=message.router.js.map