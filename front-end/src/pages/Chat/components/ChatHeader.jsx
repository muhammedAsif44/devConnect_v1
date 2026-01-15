// ChatHeader.jsx
import React from "react";

export default function ChatHeader({ onlineUsers, selectedFriend, onVideoCall }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3 min-w-0">
        {selectedFriend && (
          <>
            <div className="relative shrink-0">
              <img
                src={selectedFriend.profilePhoto || "/default-avatar.png"}
                alt={selectedFriend.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              {onlineUsers?.includes(selectedFriend._id) && (
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 text-base truncate">{selectedFriend.name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 truncate">
                  {selectedFriend.role === "mentor" ? "Mentor" : "Developer"}
                </span>
                {onlineUsers?.includes(selectedFriend._id) && (
                  <span className="text-green-600 font-medium flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button className="p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-full hover:bg-gray-100" title="Voice call">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button
          onClick={onVideoCall}
          className="p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-full hover:bg-gray-100"
          title="Video call"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="p-2 text-gray-500 hover:text-[#032f60] transition-colors rounded-full hover:bg-gray-100" title="Options">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
