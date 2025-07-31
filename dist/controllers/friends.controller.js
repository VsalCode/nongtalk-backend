"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFriend = addFriend;
exports.getAllFriends = getAllFriends;
const db_config_1 = require("../config/db.config");
async function addFriend(req, res) {
    try {
        const userLoginId = parseInt(req.userId);
        const { friendCode } = req.body;
        const currentUser = await db_config_1.prisma.user.findUnique({
            where: { id: userLoginId }
        });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found",
            });
        }
        if (currentUser.userCode === friendCode) {
            return res.status(400).json({
                success: false,
                message: "Cannot add yourself as friend",
            });
        }
        const friend = await db_config_1.prisma.user.findUnique({
            where: { userCode: friendCode },
        });
        if (!friend) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const existingRelationship = await db_config_1.prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        userId: currentUser.id,
                        friendId: friend.id
                    },
                    {
                        userId: friend.id,
                        friendId: currentUser.id
                    },
                ],
            },
        });
        if (existingRelationship) {
            return res.status(400).json({
                success: false,
                message: "Friend relationship already exists",
            });
        }
        const newFriend = await db_config_1.prisma.friend.create({
            data: {
                userId: currentUser.id,
                friendId: friend.id,
            },
            include: {
                friend: {
                    select: {
                        userCode: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(201).json({
            success: true,
            message: "Friend added successfully",
            results: {
                id: newFriend.id,
                friend: {
                    userCode: newFriend.friend.userCode,
                    username: newFriend.friend.username,
                    email: newFriend.friend.email,
                },
                createdAt: newFriend.createdAt,
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to add friend",
            errors: err instanceof Error ? err.message : "Unknown error",
        });
    }
}
async function getAllFriends(req, res) {
    try {
        const userLoginId = await parseInt(req.userId);
        const friends = await db_config_1.prisma.friend.findMany({
            where: {
                userId: userLoginId
            },
            include: {
                friend: true
            }
        });
        if (friends.length === 0) {
            res.status(404).json({
                success: false,
                message: `User with id ${userLoginId} has no friends.`,
            });
            return;
        }
        const result = friends.map((f) => f.friend);
        res.status(200).json({
            success: true,
            message: "Get all friends successfully",
            results: result
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed request",
            errors: err instanceof Error ? err.message : "Unknown error",
        });
    }
}
//# sourceMappingURL=friends.controller.js.map