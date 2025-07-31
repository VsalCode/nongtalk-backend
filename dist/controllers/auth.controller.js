"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.register = void 0;
const db_config_1 = require("../config/db.config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const existing = await db_config_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({
                success: false,
                message: "Email already used"
            });
            return;
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await db_config_1.prisma.user.create({
            data: {
                email,
                username,
                userCode: "USR" + Math.floor(100000 + Math.random() * 900000),
                password: hash,
            },
        });
        res.status(201).json({
            success: true,
            message: "user registered successfully!",
            results: user
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to send request!",
            errors: err
        });
    }
};
exports.register = register;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userLogin = await db_config_1.prisma.user.findUnique({ where: { email } });
        if (!userLogin) {
            res.status(400).json({
                success: false,
                message: "User Not Found"
            });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, userLogin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                errors: { password: "Incorrect password" },
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ id: userLogin.id }, secret, { expiresIn: "1d" });
        res.status(200).json({
            success: true,
            message: "user login successfully!",
            results: token
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to send request!",
            errors: err instanceof Error ? err.message : "Unknown error"
        });
    }
};
exports.Login = Login;
//# sourceMappingURL=auth.controller.js.map