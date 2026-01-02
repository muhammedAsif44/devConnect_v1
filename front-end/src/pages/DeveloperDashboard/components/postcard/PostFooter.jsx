import React from "react";
import { Heart, Flag, MessageCircle } from "lucide-react";

const PostFooter = ({
  liked,
  likesCount,
  onLike,
  onReport,
  toggleComments,
  reported,
}) => {
  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-5">
        {/* Like Button */}
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-sm font-medium ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            fill={liked ? "currentColor" : "none"}
            strokeWidth={2}
          />
          {likesCount}
        </button>

        {/* Comment Toggle */}
        <button
          onClick={toggleComments}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
        >
          <MessageCircle size={18} />
          Comment
        </button>
      </div>

      {/* Report */}
      <button
        onClick={onReport}
        className={`flex items-center gap-1 text-sm font-medium ${
          reported ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}
      >
        <Flag size={16} />
        Report
      </button>
    </div>
  );
};

export default PostFooter;
