import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      token?: string;
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const verifyToken = async (
  req: Request, 
  res: Response<ApiResponse>, 
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token not provided"
    });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "The token format is invalid."
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayload;
    
    if (!decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "The token doesn't have a valid user ID."
      });
    }

    req.userId = decoded.userId;
    req.token = token;
    
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired."
      });
    }
    
    return res.status(403).json({
      success: false,
      message: "Token invalid."
    });
  }
};
