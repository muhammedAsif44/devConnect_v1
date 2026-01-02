import api from "./axios";

// Get reported posts
export const getReportedPosts = (params) => 
  api.get("/admin/reported-posts", { params });

// Review a single report
export const reviewReport = (reportId, action, adminNotes) =>
  api.put(`/admin/reports/${reportId}/review`, { action, adminNotes });

// Remove a post
export const removePost = (postId, adminNotes) =>
  api.delete(`/admin/posts/${postId}/remove`, { data: { adminNotes } });

// Dismiss all reports for a post
export const dismissReports = (postId, adminNotes) =>
  api.put(`/admin/posts/${postId}/dismiss-reports`, { adminNotes });
