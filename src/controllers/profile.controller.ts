import { Request, Response } from "express"
import { prisma } from "../config/db.config"
import { ApiResponse } from "../utils/response"

export async function getUserProfile(req: Request, res: Response<ApiResponse>){
  try {
    const userLoginId = parseInt(req.userId as string)

    const profile = await prisma.user.findUnique({
      where: {
        id: userLoginId
      }
    })

    return res.status(200).json({
      success: true,
      message: "get user profile successfully",
      results: profile
    })

  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "failed to send request",
      errors: err instanceof Error ? err.message : "unknown error"
    })
  }
} 