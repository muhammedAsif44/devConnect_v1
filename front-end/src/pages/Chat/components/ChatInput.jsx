// ChatInput.jsx
import React, { useRef } from "react";

export default function ChatInput({
  message,
  setMessage,
  onSend,
  onTyping,
  onStopTyping,
}) {
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTyping?.();
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend?.();
  };

  return (
    <div className="border-t border-gray-200 bg-white p-2 sm:p-3 md:p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 sm:gap-2"
        autoComplete="off"
      >
        <button
          type="button"
          className="p-1.5 sm:p-2 text-gray-500 hover:text-[#032f60] transition-all duration-200 hover:bg-gray-100 rounded-full shrink-0"
          title="Attach file"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <button
          type="button"
          className="p-1.5 sm:p-2 text-gray-500 hover:text-[#032f60] transition-all duration-200 hover:bg-gray-100 rounded-full shrink-0"
          title="Add emoji"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <div className="flex-1 relative min-w-0">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type a message"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#032f60] focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500 border border-transparent focus:border-[#032f60]/20 shadow-sm text-sm sm:text-base"
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 sm:p-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
            message.trim() 
              ? "bg-[#032f60] text-white hover:bg-[#032f60]/90" 
              : "text-gray-400"
          } shrink-0`}
          title="Send message"
        >
          {message.trim() ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
