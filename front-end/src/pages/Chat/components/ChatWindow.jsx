// ChatWindow.jsx
import React, { useEffect, useRef, useMemo } from "react";

export default function ChatWindow({
  messages = [],
  userId,
  typingUsers,
  usersMap,
}) {
  const bottomRef = useRef(null);

  const safeMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, typingUsers]);

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {safeMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 md:p-6">
          <div className="w-20 md:w-24 h-20 md:h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 md:mb-6 border border-gray-100">
            <svg className="w-10 md:w-12 h-10 md:h-12 text-[#032f60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 md:mb-3">No messages yet</h3>
          <p className="text-gray-500 text-center max-w-sm text-sm md:text-base px-2">
            Start a conversation by sending your first message. 
          </p>
        </div>
      ) : (
        <>
          {/* Date separator */}
          <div className="flex items-center justify-center my-3 sm:my-4 px-2 sm:px-4">
            <div className="bg-gray-200 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-gray-600">Today</span>
            </div>
          </div>

          {safeMessages.map((msg, index) => {
            const sender =
              typeof msg.senderId === "object"
                ? msg.senderId
                : usersMap[msg.senderId] || {};
            const isMine =
              (typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId) === userId;

            const showAvatar = !isMine && (
              index === 0 || 
              safeMessages[index - 1]?.senderId !== msg.senderId
            );

            // Determine if we should show the time (for consecutive messages from same sender)
            const showTime = index === safeMessages.length - 1 || 
              safeMessages[index + 1]?.senderId !== msg.senderId ||
              new Date(safeMessages[index + 1]?.createdAt) - new Date(msg.createdAt) > 60000;

            return (
              <div
                key={msg._id || Math.random()}
                className={`flex mb-1 px-2 sm:px-4 ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] ${isMine ? "flex-row-reverse" : "flex-row"} items-end gap-1 sm:gap-2`}>
                  {!isMine && showAvatar && (
                    <img
                      src={sender.profilePhoto || "/default-avatar.png"}
                      alt={sender.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    />
                  )}
                  
                  {!isMine && !showAvatar && (
                    <div className="w-7 shrink-0"></div>
                  )}
                  
                  <div className="flex flex-col">
                    {!isMine && showAvatar && (
                      <span className="text-xs text-gray-500 mb-0.5 ml-2 font-medium">
                        {sender.name}
                      </span>
                    )}
                    <div className="flex items-end gap-1">
                      <div
                        className={`rounded-2xl px-3 py-2 shadow-sm text-sm ${
                          isMine
                            ? "bg-[#032f60] text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <div className="leading-relaxed whitespace-pre-wrap overflow-wrap break-word">
                          {msg.text || msg.message}
                        </div>
                      </div>
                      {showTime && (
                        <div className={`text-xs mb-0.5 ${isMine ? "text-gray-300" : "text-gray-400"}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 mb-2 ml-4 bg-white/80 backdrop-blur-sm rounded-full py-1.5 px-3 shadow-sm border border-gray-100 w-fit">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="font-medium ml-1">
                {Array.from(typingUsers)
                  .map((id) => usersMap[id]?.name || "Someone")
                  .join(", ")}
              </span>
              <span className="text-gray-400 ml-1">typing...</span>
            </div>
          )}
          <div ref={bottomRef} className="h-3"></div>
        </>
      )}
    </div>
  );
}
