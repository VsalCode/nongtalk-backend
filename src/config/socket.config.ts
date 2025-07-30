import { Server, Socket } from "socket.io";
import { prisma } from "../config/db.config";

interface MessagePayload {
  senderId: number;
  receiverId: number;
  content: string;
}

export const handleSocketConnection = (socket: Socket, io: Server) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId); 
    console.log(`User joined room: ${userId}`);
  });

  socket.on("send_message", async (data: MessagePayload) => {
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
