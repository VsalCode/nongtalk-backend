import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import { AddFriendRequest } from "../dto/friends.dto";
import { prisma } from "../config/db.config";

export async function addFriend(
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add friend",
      errors: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function getAllFriends(req: Request, res: Response<ApiResponse>) {
  try {
    const userLoginId = await parseInt(req.userId as string);
    const { search } = req.query;

    const whereCondition: any = {
      userId: userLoginId
    };

    if (search && typeof search === 'string') {
      whereCondition.friend = {
        username: {
          contains: search,
          mode: 'insensitive' 
        }
      };
    }

    const friends = await prisma.friend.findMany({
      where: whereCondition,
      include: {
        friend: true 
      }
    });

    if (friends.length === 0) {
      const message = search 
        ? `No friends found with username containing "${search}".`
        : `User with id ${userLoginId} has no friends.`;
      
      res.status(404).json({
        success: false,
        message: message,
      });
      return;
    }

    const result = friends.map((f) => f.friend);

    res.status(200).json({
      success: true,
      message: search 
        ? `Found ${result.length} friend(s) matching "${search}"`
        : "Get all friends successfully",
      results: {
        result: result,
        count: result.length
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed request",
      errors: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function deleteFriendById(req: Request, res: Response<ApiResponse>) {
  try {
    const userLoginId = parseInt(req.userId as string);
    const { friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
    }

    const friendIdInt = parseInt(friendId);
    if (isNaN(friendIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid friend ID format",
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userLoginId }
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    const friend = await prisma.user.findUnique({
      where: { id: friendIdInt },
    });

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    const existingRelationship = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            userId: userLoginId,
            friendId: friendIdInt
          },
          {
            userId: friendIdInt,
            friendId: userLoginId
          },
        ],
      },
    });

    if (!existingRelationship) {
      return res.status(404).json({
        success: false,
        message: "Friend relationship not found",
      });
    }

    await prisma.friend.delete({
      where: {
        id: existingRelationship.id
      }
    });

    return res.status(200).json({
      success: true,
      message: `Friend ${friend.username} removed successfully`,
      results: {
        deletedFriend: {
          id: friend.id,
          username: friend.username,
          userCode: friend.userCode,
          email: friend.email
        },
        deletedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Delete friend by ID error:', err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete friend",
      errors: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
