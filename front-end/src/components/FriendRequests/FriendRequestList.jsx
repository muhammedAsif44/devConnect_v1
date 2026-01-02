import React from "react";
import FriendRequestCard from "./FriendRequestCard";
import { useFriendRequests } from "../../hooks/useFriendRequests";

const FriendRequestList = ({ type = "received" }) => {
  const { requests, loading, accept, reject, cancel } = useFriendRequests(type);

  if (loading) return <p>Loading requests...</p>;

  if (!requests?.length)
    return (
      <p className="text-gray-500 text-center mt-4">
        No {type} requests.
      </p>
    );

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto">
      {requests.map((req) => (
        <FriendRequestCard
          key={req._id}
          request={req}
          type={type}
          onAccept={accept}
          onReject={reject}
          onCancel={cancel}
        />
      ))}
    </div>
  );
};

export default FriendRequestList;
