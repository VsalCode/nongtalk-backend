"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const friends_router_1 = __importDefault(require("./friends.router"));
const profile_router_1 = __importDefault(require("./profile.router"));
const message_router_1 = __importDefault(require("./message.router"));
const router = (0, express_1.Router)();
router.use("/auth", auth_router_1.default);
router.use("/friends", friends_router_1.default);
router.use("/profile", profile_router_1.default);
router.use("/message", message_router_1.default);
exports.default = router;
//# sourceMappingURL=index.router.js.map