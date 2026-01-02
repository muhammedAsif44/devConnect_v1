import api from "./axios";
import toast from "react-hot-toast";

// Follow user
export const followUser = async (userId) => {
  try {
    const { data } = await api.post(`/follow/${userId}/follow`);
    toast.success("User followed successfully!");
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to follow user");
    throw error;
  }
};

// Unfollow user
export const unfollowUser = async (userId) => {
  try {
    const { data } = await api.delete(`/follow/${userId}/unfollow`);
    toast.success("User unfollowed successfully!");
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to unfollow user");
    throw error;
  }
};