"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("", auth_middleware_1.verifyToken, message_controller_1.messageHistory);
exports.default = router;
//# sourceMappingURL=message.router.js.map