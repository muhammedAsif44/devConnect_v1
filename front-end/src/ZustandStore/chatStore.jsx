import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  messages: [],
  groupMessages: {},
  onlineUsers: [],
  typingUsers: new Set(),
  unreadConversations: {}, // conversationId -> { userId, senderName, hasNew: bool }
  conversations: [], // list of conversations for sidebar

  addMessage: (msg) => {
    const messages = get().messages;
     
    const isDuplicate = messages.some(
      existingMsg => 
        existingMsg._id === msg._id && 
        existingMsg.conversationId === msg.conversationId
    );
    
    if (isDuplicate) {
      return;
    }
    
    set({ messages: [...messages, msg] });
  },

  setMessages: (msgs) => set({ messages: msgs }),

  addGroupMessage: (msg) => set((state) => {
    const existing = state.groupMessages[msg.conversationId] || [];
     
    if (existing.find(m => m._id === msg._id)) return { groupMessages: state.groupMessages };
    const limited = [...existing, msg].slice(-100);
    return { groupMessages: { ...state.groupMessages, [msg.conversationId]: limited }};
  }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setTypingUser: (userId) => set((state) => {
    const newSet = new Set(state.typingUsers);
    newSet.add(userId);
    return { typingUsers: newSet };
  }),

  removeTypingUser: (userId) => set((state) => {
    const newSet = new Set(state.typingUsers);
    newSet.delete(userId);
    return { typingUsers: newSet };
  }),

  // Mark conversation as having unread messages
  markUnread: (conversationId, userId, senderName) => set((state) => ({
    unreadConversations: {
      ...state.unreadConversations,
      [conversationId]: { userId, senderName, hasNew: true, timestamp: Date.now() }
    }
  })),

  // Clear unread status for a conversation
  clearUnread: (conversationId) => set((state) => {
    const updated = { ...state.unreadConversations };
    delete updated[conversationId];
    return { unreadConversations: updated };
  }),

  // Set conversations list
  setConversations: (convs) => set({ conversations: convs }),

  // Move conversation to top
  moveConversationToTop: (conversationId) => set((state) => {
    const convs = state.conversations.filter(c => c._id !== conversationId);
    const targetConv = state.conversations.find(c => c._id === conversationId);
    if (targetConv) {
      return { conversations: [targetConv, ...convs] };
    }
    return { conversations: state.conversations };
  }),
}));