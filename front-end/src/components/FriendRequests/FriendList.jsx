import React, { useState } from "react";
import { useFriends } from "../../hooks/useFriendRequests";
import UserRoleBadge from "../shared/UserRoleBadge";
import UserProfileModal from "../../components/UserProfileModal";
import { ChevronRight, Users, Code } from "lucide-react"; 

export default function FriendList() {
  const { friends } = useFriends(); 
  const [openProfileId, setOpenProfileId] = useState(null);

  if (!friends.length)
    return (
      // Clean, Left-Aligned Empty State
      <div className="p-6 mt-8 bg-white border border-dashed border-gray-300 rounded-xl shadow-inner text-left">
        <Users className="w-6 h-6 text-blue-500 mb-3" />
        <p className="text-gray-700 text-lg font-semibold">
          No Connections Yet.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Start building your developer network by sending your first friend request!
        </p>
      </div>
    );

  return (
    // Compact horizontal grid layout for friend cards
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"> 
      {friends.map(friend => (
        // Compact Card Design
        <div
          key={friend._id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer hover:border-blue-400 overflow-hidden group"
          onClick={() => setOpenProfileId(friend._id)}
        >
          {/* Compact Card Content */}
          <div className="p-3 flex flex-col items-center text-center">
            {/* Smaller Avatar */}
            <div className="relative flex-shrink-0 mb-2">
              <img
                src={friend.profilePhoto || "/default-avatar.png"}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white ring-1 ring-blue-500/30 shadow-sm bg-gray-100 group-hover:ring-blue-500/50 transition-all"
              />
              {/* Smaller online status indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-white"></span>
            </div>
            
            {/* Compact Name and Role */}
            <div className="w-full min-h-[3rem]">
              <span className="font-semibold text-sm text-gray-900 truncate block px-1" title={friend.name}>
                {friend.name}
              </span>
              <div className="flex justify-center mt-1">
                <UserRoleBadge role={friend.role} size="small" />
              </div>
              {friend.username && (
                <p className="text-xs text-gray-500 mt-0.5 truncate px-1" title={`@${friend.username}`}>
                  @{friend.username}
                </p>
              )}
            </div>

            {/* Compact View Profile Button */}
            <button
              aria-label={`View profile of ${friend.name}`}
              style={{ backgroundColor: '#032f60' }}
              className="w-full flex items-center justify-center gap-1 text-xs font-medium text-white px-2 py-1.5 rounded-md shadow-sm hover:opacity-90 transition duration-150 mt-2"
              onClick={(e) => {
                e.stopPropagation();
                setOpenProfileId(friend._id);
              }}
            >
              <span className="hidden sm:inline">View</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="w-3 h-3" /> 
            </button>
          </div>

          {/* User Profile Modal */}
          {openProfileId === friend._id && (
            <UserProfileModal
              userId={friend._id}
              isOpen={!!openProfileId}
              onClose={() => setOpenProfileId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}