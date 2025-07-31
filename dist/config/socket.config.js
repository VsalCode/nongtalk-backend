"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const db_config_1 = require("../config/db.config");
const handleSocketConnection = (socket, io) => {
    console.log("✅ Socket connected:", socket.id);
    socket.on("join", (userCode) => {
        socket.join(userCode);
        console.log(`User joined room: ${userCode}`);
    });
    socket.on("send_message", async (data) => {
        const { senderId, receiverId, content } = data;
        const message = await db_config_1.prisma.message.create({
            data: {
                senderId,
                receiverId,
                content
            }
        });
        io.to(String(receiverId)).emit("receive_message", message);
    });
    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
};
exports.handleSocketConnection = handleSocketConnection;
//# sourceMappingURL=socket.config.js.map