import express from "express";
import dotenv from "dotenv";
import routers from "./routers/index.router";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./config/socket.config";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/", routers);
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Nongtalk API!",
        results: null,
        errors: null,
    });
});
app.use((_, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        results: null,
        errors: null,
    });
});
// server + socket.io setup
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // frontend URL
    },
});
io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    handleSocketConnection(socket, io);
});
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map