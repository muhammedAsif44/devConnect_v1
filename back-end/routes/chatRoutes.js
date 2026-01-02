const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// ✅ Get all conversations for a user
router.get("/conversations/:userId", chatController.getUserConversations);

// ✅ Private 1:1 chat
router.post("/conversation", chatController.getOrCreateConversation);

// ✅ Group chat
router.post("/conversation/group", chatController.createGroupConversation);

// ✅ Fetch all messages from a conversation
router.get("/messages/:conversationId", chatController.getMessages);

// ✅ Send message
router.post("/messages", chatController.sendMessage);

module.exports = router;
