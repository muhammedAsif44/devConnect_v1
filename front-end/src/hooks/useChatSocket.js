import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useChatStore } from "../ZustandStore/chatStore";
import {
  registerChatEvents,
  removeChatEvents,
  emitUserOnline,
  sendMessage as emitSendMessage,
  joinRoom,
  emitTyping,
  emitStopTyping,
  setCurrentConversationId,
} from "../socket/events/chatEvents";

export function useChatSocket(userId) {
  const {
    addMessage,
    addGroupMessage,
    setOnlineUsers,
    setTypingUser,
    removeTypingUser,
    markUnread,
  } = useChatStore();

  useEffect(() => {
    if (!userId) return;

    // Always clean up previous event listeners first to prevent duplicates
    removeChatEvents();

    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();

      socket.on("connect", () => {
        emitUserOnline(userId);
        registerChatEvents({
          onOnlineUsers: setOnlineUsers,
          onNewMessage: addMessage,
          onNewGroupMessage: addGroupMessage,
          onTyping: setTypingUser,
          onStopTyping: removeTypingUser,
          onMarkUnread: markUnread,
        });
      });

      socket.on("disconnect", () => {
        // Socket disconnected, will attempt to reconnect automatically
      });
    } else {
      // If already connected, just update the user online status and register events
      emitUserOnline(userId);
      registerChatEvents({
        onOnlineUsers: setOnlineUsers,
        onNewMessage: addMessage,
        onNewGroupMessage: addGroupMessage,
        onTyping: setTypingUser,
        onStopTyping: removeTypingUser,
        onMarkUnread: markUnread,
      });
    }

    return () => {
      removeChatEvents();
    };
  }, [userId, addMessage, addGroupMessage, setOnlineUsers, setTypingUser, removeTypingUser, markUnread]);

  return {
    sendMessage: emitSendMessage,
    joinRoom: (conversationId) => {
      setCurrentConversationId(conversationId);
      joinRoom(conversationId);
    },
    emitTyping,
    emitStopTyping,
  };
}