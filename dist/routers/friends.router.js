"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_middleware_1 = require("../middlewares/auth.middleware");
const friends_controller_1 = require("../controllers/friends.controller");
router.post("", auth_middleware_1.verifyToken, friends_controller_1.addFriend);
router.get("", auth_middleware_1.verifyToken, friends_controller_1.getAllFriends);
exports.default = router;
//# sourceMappingURL=friends.router.js.map