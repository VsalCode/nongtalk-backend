"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = getUserProfile;
exports.updateUsername = updateUsername;
const db_config_1 = require("../config/db.config");
async function getUserProfile(req, res) {
    try {
        const userLoginId = parseInt(req.userId);
        const profile = await db_config_1.prisma.user.findUnique({
            where: {
                id: userLoginId
            }
        });
        return res.status(200).json({
            success: true,
            message: "get user profile successfully",
            results: profile
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed to send request",
            errors: err instanceof Error ? err.message : "unknown error"
        });
    }
}
async function updateUsername(req, res) {
    try {
        const userLoginId = parseInt(req.userId);
        const { username } = req.body;
        const updatedProfie = await db_config_1.prisma.user.update({
            where: {
                id: userLoginId
            },
            data: {
                username: username
            }
        });
        if (!updatedProfie) {
            return res.status(500).json({
                success: false,
                message: "failed update username or user not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "update username succesfully",
            results: updatedProfie
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed to send request",
            errors: err instanceof Error ? err.message : "unknown error"
        });
    }
}
//# sourceMappingURL=profile.controller.js.map