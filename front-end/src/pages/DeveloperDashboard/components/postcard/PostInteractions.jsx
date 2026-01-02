import React from "react";
import { Heart, MessageCircle, Flag } from "lucide-react";

const PostInteractions = ({
  likeCount,
  liked,
  commentsCount,
  isOwner,
  onLike,
  onComment,
  onReport,
  showCommentInput,
  showAllComments,
  setShowAllComments,
}) => {
  return (
    <>
      {/* Interaction Stats */}
      <div className="px-4 md:px-6 py-2.5 flex items-center justify-between text-xs md:text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {likeCount > 0 && (
            <button className="hover:underline cursor-pointer flex items-center gap-1.5 group">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-3 h-3 fill-white text-white" />
              </div>
              <span className="font-medium text-gray-600">{likeCount}</span>
            </button>
          )}
          {commentsCount > 0 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="hover:underline cursor-pointer font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </button>
          )}
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-4 md:px-6 py-2 flex items-center border-b border-gray-100">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-gray-100 ${
            liked ? "text-red-600" : "text-gray-600"
          }`}
        >
          <Heart className={`w-5 h-5 transition-all ${liked ? "fill-red-600" : ""}`} />
          <span className="text-sm font-semibold">Like</span>
        </button>

        <button
          onClick={onComment}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-gray-100 ${
            showCommentInput ? "text-sky-600" : "text-gray-600"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>

        {!isOwner && (
          <button
            onClick={onReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Flag className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Report</span>
          </button>
        )}
      </div>
    </>
  );
};

export default PostInteractions;
