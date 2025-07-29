import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ApiResponse } from "./utils/response";
import routers from "./routers/index.router"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/", routers)

app.get("/", (_, res: Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Nongtalk API!",
  });
});

app.use((_, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});