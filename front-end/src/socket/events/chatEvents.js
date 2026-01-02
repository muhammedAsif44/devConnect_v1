import { socket } from "../socket";

// 🔒 store references to listener functions so we can cleanly remove them
let listeners = {};
let currentConversationId = null;

// Set the current conversation ID to filter messages
export const setCurrentConversationId = (conversationId) => {
  currentConversationId = conversationId;
};

export const registerChatEvents = (handlers = {}) => {
  removeChatEvents(); // always clean up before registering new

  listeners = {
    onlineUsers: (users) => handlers.onOnlineUsers?.(users),
    newMessage: (msg) => {
      // If message is not from current conversation, mark as unread
      if (currentConversationId && msg.conversationId !== currentConversationId) {
        handlers.onMarkUnread?.(msg.conversationId, msg.senderId, msg.senderName);
      }
      // Handle the message regardless
      handlers.onNewMessage?.(msg);
    },
    newGroupMessage: (msg) => handlers.onNewGroupMessage?.(msg),
    userTyping: ({ userId }) => handlers.onTyping?.(userId),
    userStoppedTyping: ({ userId }) => handlers.onStopTyping?.(userId),
  };

  Object.entries(listeners).forEach(([event, fn]) => {
    socket.on(event, fn);
  });
};

export const emitUserOnline = (userId) => socket.emit("userOnline", userId);
export const joinRoom = (conversationId) => {
  setCurrentConversationId(conversationId);
  socket.emit("joinRoom", conversationId);
};
export const sendMessage = (msgData) => socket.emit("sendMessage", msgData);
export const emitTyping = (conversationId, userId) =>
  socket.emit("typing", { conversationId, userId });
export const emitStopTyping = (conversationId, userId) =>
  socket.emit("stopTyping", { conversationId, userId });

export const removeChatEvents = () => {
  Object.entries(listeners).forEach(([event, fn]) => {
    socket.off(event, fn);
  });
  listeners = {};
  currentConversationId = null;
};