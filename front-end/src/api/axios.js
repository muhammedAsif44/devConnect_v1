import axios from "axios";

// ============================================
// API CONFIGURATION
// ============================================
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Required for sending cookies
});

// ============================================
// TOKEN REFRESH MANAGEMENT
// ============================================
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Add failed request to queue while token is being refreshed
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Execute all queued requests after token refresh
 */
const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

/**
 * Clear queue on refresh failure
 */
const onRefreshError = () => {
  refreshSubscribers = [];
};

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
  // Success response - pass through
  (response) => response,

  // Error response - handle token expiration
  async (error) => {
    const originalRequest = error.config;
    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.tokenExpired;

    // If token expired and we haven't retried yet
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            api(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh-token");

        // Success - notify all queued requests
        isRefreshing = false;
        onTokenRefreshed();

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed
        isRefreshing = false;
        onRefreshError();

        // If refresh token expired, redirect to login
        if (refreshError.response?.data?.requireLogin) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Not a token expiration error - reject normally
    return Promise.reject(error);
  }
);

export default api;