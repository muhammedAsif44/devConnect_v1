import React from "react";
import { Check, X } from "lucide-react";

const FriendRequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  const user = type === "received" ? request.sender : request.receiver;
  if (!user?._id) return null;

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3">
        <img
          src={user.profilePhoto || "/default-avatar.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {type === "received" ? (
          <>
            <button
              onClick={() => onAccept(user._id)}
              type="button"
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <Check size={16} />
              Accept
            </button>
            <button
              onClick={() => onReject(user._id)}
              type="button"
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              <X size={16} />
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => onCancel(user._id)}
            type="button"
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
