import axios from "axios";

// ============================================
// API CONFIGURATION
// ============================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
    // Safely check for response status
    if (error.response?.status === 401 && !originalRequest._retry) {

      // 1. NEVER refresh if the failed request was login, refresh-token, or logout
      //    (Prevents infinite loops on these endpoints)
      const url = originalRequest.url || "";
      if (url.includes("/auth/login") || url.includes("/auth/refresh-token") || url.includes("/auth/logout") || url.includes("/auth/profile")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 2. If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            api(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // 3. Start refresh process
      isRefreshing = true;

      try {
        await api.post("/auth/refresh-token");
        isRefreshing = false;
        onTokenRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshError();

        // 4. Only redirect to login if we are not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;