import { prisma } from "../config/db.config";
export const handleSocketConnection = (socket, io) => {
    console.log("✅ Socket connected:", socket.id);
    socket.on("join", (userCode) => {
        socket.join(userCode);
        console.log(`User joined room: ${userCode}`);
    });
    socket.on("send_message", async (data) => {
        const { senderId, receiverId, content } = data;
        const message = await prisma.message.create({
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
//# sourceMappingURL=socket.config.js.map