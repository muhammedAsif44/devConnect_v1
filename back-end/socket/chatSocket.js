const Message = require("../model/messageSchema");
const Conversation = require("../model/conversationSchema");

module.exports = (io) => {
  const onlineUsers = new Map(); // Map<userId, socketId>

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

 socket.on("userOnline", (userId) => {
  const isNewUser = !onlineUsers.has(userId);
  onlineUsers.set(userId, socket.id);
  if (isNewUser) {
    io.emit("onlineUsers", Array.from(onlineUsers.keys())); // Broadcast only when a new user comes online
    console.log(`✅ User ${userId} is online`);
  }
});

    // User joins a 1:1 conversation room by conversationId
    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined room: ${conversationId}`);
    });

    // Typing indicator
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("userTyping", { userId });
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("userStoppedTyping", { userId });
    });

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, text, mediaUrl } = data;

      try {
        // Store message in DB
        const message = await Message.create({
          conversationId,
          senderId,
          text,
          mediaUrl,
        });

        // Update conversation's last message timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessageAt: new Date(),
        });

        // Broadcast to all clients in room
        io.to(conversationId).emit("newMessage", message);

        // Logging for diagnostics
        console.log(`📩 Message from ${senderId} in ${conversationId}: "${text}"`);
      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });

    // Group chat join
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`User joined group chat: ${groupId}`);
    });

    // Group chat send
    socket.on("sendGroupMessage", async (data) => {
      const { groupId, senderId, text } = data;

      try {
        const message = await Message.create({
          conversationId: groupId,
          senderId,
          text,
        });

        io.to(groupId).emit("newGroupMessage", message);
      } catch (err) {
        console.error("❌ Group message error:", err.message);
      }
    });

    // User disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("onlineUsers", Array.from(onlineUsers.keys())); // Update everyone
          console.log(`  User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};
