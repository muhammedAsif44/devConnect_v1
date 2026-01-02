import React, { useState } from "react";
import { UserPlus, Clock, Check } from "lucide-react";
import { useFriendRequests } from "../../hooks/useFriendRequests";

const SendFriendRequestButton = ({ recipientId, initialStatus = "none" }) => {
  const { send } = useFriendRequests();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await send(recipientId);
      setStatus("pending");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "pending")
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-semibold"
      >
        <Clock size={16} /> Request Sent
      </button>
    );

  if (status === "accepted")
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold"
      >
        <Check size={16} /> Connected
      </button>
    );

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#032f60] text-white rounded-xl font-semibold hover:bg-[#021d38]"
    >
      <UserPlus size={16} /> Connect
    </button>
  );
};

export default SendFriendRequestButton;
