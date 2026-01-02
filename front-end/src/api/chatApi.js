import api from "./axios";

// Get or create a conversation between two users
export const getOrCreateConversation = async (senderId, receiverId) => {
  const res = await api.post("/chat/conversation", { senderId, receiverId });
  return res.data;
};

// Get all messages in a conversation
export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/messages/${conversationId}`);
  return res.data;
};

// Send a message
export const sendMessage = async (messageData) => {
  const res = await api.post("/chat/message", messageData);
  return res.data;
};

// Get all conversations for a user
export const getUserConversations = async (userId) => {
  const res = await api.get(`/chat/conversations/${userId}`);
  return res.data;
};