import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Flag } from "lucide-react";
import PremiumBadge from "../../../../components/shared/PremiumBadge";
import MentorBadge from "../../../../components/shared/MentorBadge";

const PostHeader = ({ userId, timeAgo, isOwner, onEdit, onDelete, onReport }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="flex justify-between items-start p-4 md:p-6 pb-3">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold text-white shadow-sm overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 flex-shrink-0 ring-2 ring-transparent group-hover:ring-sky-300 transition-all duration-200">
            {userId?.profilePhoto ? (
              <img
                src={userId.profilePhoto}
                alt={userId.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  e.target.parentElement.textContent = getInitials(userId?.name);
                }}
              />
            ) : (
              getInitials(userId?.name)
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm md:text-base font-semibold text-gray-900 hover:text-sky-600 hover:underline transition-all cursor-pointer truncate">
              {userId?.name || "Unknown User"}
            </p>
            {userId && (
              <>
                <PremiumBadge user={userId} variant="small" />
                <MentorBadge user={userId} variant="small" />
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
            {timeAgo}
          </p>
        </div>
      </div>

      {/* More Options Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              {isOwner ? (
                <>
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-t-lg"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onReport();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
