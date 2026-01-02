// src/api/postApi.js

import api from "./axios";

// Get all posts
export const getPosts = () => api.get("/post");

// Create a post
export const createPost = (formData) =>
  api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Like/unlike a post
export const toggleLikePost = (postId) => api.post(`/post/${postId}/like`);

// Report a post
export const reportPost = (postId, reason, description) => 
  api.post(`/post/${postId}/report`, { reason, description });

// Delete a post
export const deletePost = (postId) => api.delete(`/post/${postId}`);

// Update a post
export const updatePost = (postId, content, imageFile) => {
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) formData.append("image", imageFile);
  return api.put(`/post/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Add a comment
export const addComment = (postId, text) =>
  api.post(`/post/${postId}/comment`, { text });

// Delete a comment
export const deleteComment = (postId, commentId) =>
  api.delete(`/post/${postId}/comment/${commentId}`);
