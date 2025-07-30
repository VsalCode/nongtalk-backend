import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import { AddFriendRequest } from "../dto/friends.dto";
import { prisma } from "../config/db.config";

export async function addFriends(
  req: Request<any, AddFriendRequest>,
  res: Response<ApiResponse>
) {
  try {
    const userLoginId = parseInt(req.userId as string);
    const { friendCode } = req.body; 

    const currentUser = await prisma.user.findUnique({
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

    const friend = await prisma.user.findUnique({
      where: { userCode: friendCode }, 
    });

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingRelationship = await prisma.friend.findFirst({
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

    const newFriend = await prisma.friend.create({
      data: {
        userId: currentUser.id,
        friendId: friend.id,
      },
      include: {
        friend: {
          select: {
            userCode: true, // Changed from userId to userCode
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

  } catch (err) {
    console.error("Error adding friend:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add friend",
      errors: err instanceof Error ? err.message : "Unknown error",
    });
  }
}