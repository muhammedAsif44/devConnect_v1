// ChatPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useChatSocket } from "../../hooks/useChatSocket";
import { socket } from "../../socket/socket";
import { useChatStore } from "../../ZustandStore/chatStore";
import useAuthStore from "../../ZustandStore/useAuthStore";
import { useFriends } from "../../hooks/useFriendRequests";
import { useAllUsers } from "../../hooks/useAllUsers";
import ChatHeader from "./components/ChatHeader";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import {
  getMessages,
  getOrCreateConversation,
} from "../../api/chatApi";
import { showError } from "../../utils/toastManager";
import Shimmer from "../../components/Shimmer";
import { getUserProfile } from "../../api/users";
import { useCallStore } from "../../ZustandStore/callStore";

export default function ChatPage() {
  const { user, isPremium } = useAuthStore();
  const userId = user?._id;
  const { friends, loading: friendsLoading } = useFriends();
  const { users: allUsers, loading: allUsersLoading } = useAllUsers();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [loadedConversations, setLoadedConversations] = useState(new Set());
  const location = useLocation();

  const { messages, setMessages, onlineUsers, typingUsers, clearUnread } = useChatStore();
  const { sendMessage, joinRoom, emitTyping, emitStopTyping } = useChatSocket(userId);
  const { startVideoCall } = useCallStore();

  // Auto-select user from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdParam = urlParams.get('userId');

    if (userIdParam && !selectedFriend) {
      const fetchAndSelectUser = async () => {
        try {
          const userData = await getUserProfile(userIdParam);
          if (userData) {
            handleSelectFriend(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          showError("Failed to load user for chat");
        }
      };

      fetchAndSelectUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const usersMap = useMemo(() => {
    const map = {};

    for (const friend of friends) {
      map[friend._id] = friend;
    }

    if (isPremium) {
      for (const usr of allUsers) {
        map[usr._id] = usr;
      }
    }

    if (user) {
      map[user._id] = user;
    }
    return map;
  }, [friends, allUsers, isPremium, user]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, close sidebar by default to show chat content
      if (mobile && (!selectedFriend || sidebarOpen)) {
        setSidebarOpen(false);
      } else if (!mobile && !sidebarOpen) {
        // On desktop, ensure sidebar is open
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, selectedFriend]);

  // NOTE: joinRoom and clearUnread intentionally excluded from dependencies
  // They are stable socket event emitters and including them would cause infinite loop
  // when conversation changes
  // Handle joining room on conversation change AND on socket reconnection
  useEffect(() => {
    if (!activeConversationId) return;

    // Join the room immediately
    joinRoom(activeConversationId);

    // Also re-join if the socket reconnects while we are on this page
    const handleReconnect = () => {

      joinRoom(activeConversationId);
    };

    const handleConnectError = (err) => {
      console.error("Socket connection error:", err);
    };

    socket.on("connect", handleReconnect);
    socket.on("connect_error", handleConnectError);

    // Clear unread separately after join completes
    const timer = setTimeout(() => {
      clearUnread(activeConversationId);
    }, 500); // Slight delay to ensure processing

    return () => {
      clearTimeout(timer);
      socket.off("connect", handleReconnect);
      socket.off("connect_error", handleConnectError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    // Only load messages if we haven't already
    if (loadedConversations.has(activeConversationId)) {
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await getMessages(activeConversationId);
        const otherConversationMessages = messages.filter(msg =>
          msg.conversationId !== activeConversationId
        );
        const newConversationMessages = res?.messages || [];
        const combinedMessages = [...otherConversationMessages];

        for (const newMsg of newConversationMessages) {
          const isDuplicate = combinedMessages.some(
            existingMsg =>
              existingMsg._id === newMsg._id &&
              existingMsg.conversationId === newMsg.conversationId
          );
          if (!isDuplicate) {
            combinedMessages.push(newMsg);
          }
        }

        setMessages(combinedMessages);
        setLoadedConversations(prev => new Set([...prev, activeConversationId]));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    loadMessages();
  }, [activeConversationId, setMessages, loadedConversations, messages]);

  const handleSelectFriend = async (friend) => {
    if (!userId || !friend._id) {
      showError("User ID or Friend ID missing!");
      return;
    }
    try {
      setSelectedFriend(friend);
      const res = await getOrCreateConversation(userId, friend._id);
      const conversationId = res?.conversation?._id;
      if (!conversationId) {
        showError("Could not create or obtain a conversation!");
        return;
      }
      setActiveConversationId(conversationId);
      // Close sidebar on mobile after selecting
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error("handleSelectFriend failed:", err);
      if (err.response?.status === 403) {
        showError("You need to be friends to message this user. Send a friend request first.");
      } else {
        showError("Error creating or fetching conversation!");
      }
    }
  };

  // Auto-select user from navigation state (from bookings chat click)
  useEffect(() => {
    if (location.state?.selectedUserId && !selectedFriend) {
      const userToSelect = location.state.selectedUser;
      if (userToSelect) {
        handleSelectFriend(userToSelect);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.selectedUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) return;

    const msgData = {
      conversationId: activeConversationId,
      senderId: userId,
      text: message.trim(),
    };

    try {
      sendMessage(msgData);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setMessage("");
  };

  const filteredMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages.filter(msg =>
      msg.conversationId === activeConversationId
    );
  }, [messages, activeConversationId]);

  // Note: Removed cleanup function that was clearing messages on unmount
  // Messages should persist for conversation history

  const loading = isPremium ? allUsersLoading : friendsLoading;

  if (loading) return (
    <div className="flex h-screen bg-white items-center justify-center">
      <div className="text-center">
        <Shimmer type="large" className="mx-auto mb-4" />
        <p className="text-gray-600">Loading chat...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-[#032f60] text-white px-3 sm:px-4 md:px-6 py-4 md:py-6 shadow-xl rounded-b-2xl sm:rounded-b-3xl sticky top-0 z-40">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Messages</h2>
                <p className="text-white/80 text-xs sm:text-sm max-w-full line-clamp-2">
                  Connect and collaborate with mentors, developers, and colleagues
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 border border-white/20 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">
                  {onlineUsers?.length || 0} Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden gap-1 sm:gap-2 md:gap-4 p-1 sm:p-2 md:p-4 bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Always visible, responsive width */}
        <aside
          className={`${isMobile
            ? sidebarOpen
              ? "absolute inset-y-0 left-0 w-full max-w-xs sm:max-w-sm z-50"
              : "hidden"
            : "w-full max-w-xs sm:max-w-sm md:max-w-sm"
            } bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col`}
        >
          {isMobile && sidebarOpen && (
            <div className="p-2 bg-gray-50 border-b border-gray-200 flex justify-end">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <ChatSidebar
            selectedFriend={selectedFriend}
            onSelectFriend={handleSelectFriend}
            userId={userId}
            setActiveConversationId={setActiveConversationId}
            onlineUsers={onlineUsers}
          />
        </aside>

        {/* Chat Area */}
        <main className="flex flex-col flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden min-w-0">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 sticky top-0 z-10 bg-white">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 mb-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                    title="Open sidebar"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <ChatHeader
                  onlineUsers={onlineUsers}
                  selectedFriend={selectedFriend}
                  onVideoCall={() => startVideoCall(selectedFriend)}
                />
              </div>

              {/* Chat Window */}
              <div className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6">
                <ChatWindow
                  messages={filteredMessages}
                  userId={userId}
                  typingUsers={typingUsers}
                  usersMap={usersMap}
                />
              </div>

              {/* Chat Input - Sticky at bottom */}
              <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 border-t border-gray-100 bg-gray-50 sticky bottom-0">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSend={handleSendMessage}
                  onTyping={() => emitTyping(activeConversationId, userId)}
                  onStopTyping={() => emitStopTyping(activeConversationId, userId)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 md:p-8 text-gray-500">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-[#032f60] text-white rounded-lg sm:rounded-xl hover:bg-[#024a8f] transition-colors text-sm sm:text-base font-medium"
                  title="Open sidebar"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Open Conversations
                </button>
              )}
              <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-[#032f60] rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
                <svg className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 
                       4.418-4.03 8-9 8a9.863 9.863 0 
                       01-4.255-.949L3 20l1.395-3.72C3.512 
                       15.042 3 13.574 3 12c0-4.418 
                       4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">Select a Conversation</h3>
              <p className="text-gray-500 text-center max-w-sm text-xs sm:text-sm md:text-base mb-6 sm:mb-8">
                Choose a user from the sidebar to start messaging and collaborating
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Mentors
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Developers
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}