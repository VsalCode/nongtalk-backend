import { Request, Response } from "express"
import { prisma } from "../config/db.config"
import { ApiResponse } from "../utils/response";

export const messageHistory = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const user1 = parseInt(req.userId as string);
    const { friendCode } = req.body;

    if (!friendCode || isNaN(user1)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid userId / friendCode",
        results: null,
      });
    }

    const friend = await prisma.user.findUnique({
      where: { userCode: friendCode },
    });

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
        results: null,
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: friend.id },
          { senderId: friend.id, receiverId: user1 },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    res.status(200).json({
      success: true,
      message: "Chat history loaded",
      results: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get message history",
      errors: err instanceof Error ? err.message : "unknown",
    });
  }
};
