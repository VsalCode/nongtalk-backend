import { Response, Request } from "express"
import { prisma } from "../db/config"
import { ApiResponse } from "../utils/response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, username, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({
        success: false,
        message: "Email already used"
      });
      return
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        userId: "USR" + Math.floor(100000 + Math.random() * 900000),
        password: hash,
      },
    });

    res.status(201).json({
      success: true,
      message: "user registered successfully!",
      results: user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send request!",
      errors: err
    });
  }

};

export const Login = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password } = req.body

    const userLogin = await prisma.user.findUnique({ where: { email } })
    if (!userLogin) {
      res.status(400).json({
        success: false,
        message: "User Not Found"
      });
      return
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
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
    const token = jwt.sign({ id: userLogin.id }, secret, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "user login successfully!",
      results: token
    });

  } catch (err) {
    res.status(500).json({
    success: false,
    message: "Failed to send request!",
    errors: err instanceof Error ? err.message : "Unknown error"
  });
  }
}