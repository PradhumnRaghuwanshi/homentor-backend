const users = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("register", (phone) => {
      users.set(phone, socket.id);
    });

    socket.on("send-message", (data) => {
      const receiverSocketId = users.get(data.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", data);
      }
    });

    socket.on("disconnect", () => {
      for (let [phone, id] of users.entries()) {
        if (id === socket.id) users.delete(phone);
      }
    });
  });
};

module.exports = setupSocket;
