import React from "react";
import { Send } from "lucide-react";

const PostCommentInput = ({ commentText, setCommentText, onAddComment }) => {
  return (
    <div className="px-4 md:px-6 pb-4 pt-3 border-t border-gray-100">
      <div className="flex gap-2.5 items-end">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-br from-sky-400 to-blue-500 flex-shrink-0">
          U
        </div>
        <div className="flex-1 relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none bg-gray-50 hover:bg-gray-100 transition-all"
            rows="1"
            style={{
              minHeight: "40px",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              e.target.style.height = "40px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onAddComment();
              }
            }}
          />
          <button
            onClick={onAddComment}
            disabled={!commentText.trim()}
            className={`absolute right-2.5 bottom-2.5 p-1.5 rounded-full transition-all ${
              commentText.trim()
                ? "text-sky-600 hover:bg-sky-100 cursor-pointer"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCommentInput;
