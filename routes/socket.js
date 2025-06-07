const ChatMessage = require("../models/ChatMessage");
const users = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New connection:", socket.id);

    socket.on("register", (phone) => {
      users.set(phone, socket.id);
      console.log(`📱 ${phone} registered to socket ${socket.id}`);
    });

    socket.on("send-message", async ({ sender, receiver, message }) => {
      const newMessage = new ChatMessage({ sender, receiver, message });
      await newMessage.save();

      const receiverSocketId = users.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", { sender, message });
      }
    });

    socket.on("disconnect", () => {
      for (let [phone, id] of users.entries()) {
        if (id === socket.id) users.delete(phone);
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
