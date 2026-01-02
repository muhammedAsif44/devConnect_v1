import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";

const PostComments = ({
  comments,
  currentUserId,
  showAllComments,
  setShowAllComments,
  onDeleteComment,
}) => {
  const [hoveredComment, setHoveredComment] = useState(null);
  const COMMENTS_TO_SHOW = 2;

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const displayedComments = showAllComments
    ? comments
    : comments.slice(0, COMMENTS_TO_SHOW);
  const hasMoreComments = comments.length > COMMENTS_TO_SHOW;

  if (displayedComments.length === 0) return null;

  return (
    <div className="px-4 md:px-6 pt-4 pb-2 flex flex-col gap-3">
      {displayedComments.map((c) => {
        const isCommentOwner = currentUserId === c.userId?._id;
        return (
          <div
            key={c._id}
            className="flex items-start gap-2.5 group"
            onMouseEnter={() => setHoveredComment(c._id)}
            onMouseLeave={() => setHoveredComment(null)}
          >
            <div className="relative group/avatar cursor-pointer flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-transparent group-hover/avatar:ring-sky-300 transition-all duration-200">
                {c.userId?.profilePhoto ? (
                  <img
                    src={c.userId.profilePhoto}
                    alt={c.userId.name}
                    className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = getInitials(c.userId?.name);
                    }}
                  />
                ) : (
                  getInitials(c.userId?.name)
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl px-3.5 py-2 inline-block max-w-full">
                  <p className="text-xs md:text-sm font-semibold text-gray-900 hover:text-sky-600 hover:underline cursor-pointer transition-colors">
                    {c.userId?.name || "Unknown User"}
                  </p>
                  <p className="text-xs md:text-sm text-gray-800 mt-0.5 break-words leading-relaxed">
                    {c.text}
                  </p>
                </div>
                {isCommentOwner && hoveredComment === c._id && (
                  <button
                    onClick={() => onDeleteComment(c._id)}
                    className="absolute -right-1 top-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all shadow-md"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1.5 px-3">
                <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold hover:underline transition-colors">
                  Like
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold hover:underline transition-colors">
                  Reply
                </button>
                <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  {dayjs(c.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {hasMoreComments && (
        <button
          onClick={() => setShowAllComments(!showAllComments)}
          className="text-sm text-gray-600 hover:text-gray-900 font-semibold hover:underline text-left px-2 py-1 transition-colors"
        >
          {showAllComments
            ? "View less comments"
            : `View ${comments.length - COMMENTS_TO_SHOW} more ${
                comments.length - COMMENTS_TO_SHOW === 1 ? "comment" : "comments"
              }`}
        </button>
      )}
    </div>
  );
};

export default PostComments;
