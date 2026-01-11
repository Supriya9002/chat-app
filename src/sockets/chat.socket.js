import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { getIO } from "../config/socket.js";

const chatSocket = (socket) => {
  /* ---------- JOIN CHAT ROOM ---------- */
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  /* ---------- SEND MESSAGE ---------- */
  socket.on("sendMessage", async (data) => {
    try {
      const { chatId, senderId, content } = data;
      if (!chatId || !senderId || !content) return;

      const message = await MessageModel.create({
        sender: senderId,
        chat: chatId,
        content,
        status: "sent",
      });

      await ChatModel.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
      });

      getIO().to(chatId).emit("receiveMessage", message);
    } catch (error) {
      console.error("SendMessage Error:", error.message);
    }
  });

  /* ---------- TYPING INDICATOR ---------- */
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  socket.on("stopTyping", (chatId) => {
    socket.to(chatId).emit("stopTyping");
  });
};

export default chatSocket;
