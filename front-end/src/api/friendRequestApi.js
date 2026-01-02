import api from "./axios";
import toast from "react-hot-toast";

export const getPendingFriendRequests = async () => {
  const res = await api.get("/friend-requests/received");
  return res.data;
};

export const getSentFriendRequests = async () => {
  const res = await api.get("/friend-requests/sent");
  return res.data;
};

export const sendFriendRequest = async (recipientId) => {
  try {
    const res = await api.post("/friend-requests/send", { recipientId });
    toast.success("Friend request sent!");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send friend request");
    throw error;
  }
};

export const acceptFriendRequest = async (requesterId) => {
  try {
    const res = await api.put(`/friend-requests/${requesterId}/accept`);
    toast.success("Friend request accepted!");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to accept friend request");
    throw error;
  }
};

export const rejectFriendRequest = async (requesterId) => {
  try {
    const res = await api.put(`/friend-requests/${requesterId}/reject`);
    toast.success("Friend request rejected");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to reject friend request");
    throw error;
  }
};

export const cancelFriendRequest = async (recipientId) => {
  try {
    const res = await api.delete(`/friend-requests/${recipientId}/cancel`);
    toast.success("Friend request cancelled");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to cancel friend request");
    throw error;
  }
};

export const getFriends = async () => {
  const res = await api.get("/friend-requests/friends");
  return res.data;
};