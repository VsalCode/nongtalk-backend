import { Response,  Request } from "express"
import { prisma } from "../db/config"
import { ApiResponse } from "../utils/response";
const bcrypt = require("bcrypt")

export const register = async (req: Request, res: Response<ApiResponse>) => {
  const { email, username, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({
    success: false,
    message: "Email already used"
  });

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
};