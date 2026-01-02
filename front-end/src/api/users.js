import api from "./axios";

// Fetch user profile
export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}/profile`);
  // Backend may return either a wrapped { user: {...} } or the raw object
  return data?.user || data;
};

// Search users (by role, skill, etc.)
export const searchUsers = async (params) => {
  const { data } = await api.get("/users/search", { params });
  return data;
};

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
  const { data } = await api.put(`/users/${userId}`, updateData);
  return data;
};

// Upload profile photo
export const uploadProfilePhoto = async (formData) => {
  const { data } = await api.post("/users/profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
