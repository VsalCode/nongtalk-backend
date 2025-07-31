"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_router_1 = __importDefault(require("./routers/index.router"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_config_1 = require("./config/socket.config");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/", index_router_1.default);
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
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // frontend URL
    },
});
io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    (0, socket_config_1.handleSocketConnection)(socket, io);
});
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map