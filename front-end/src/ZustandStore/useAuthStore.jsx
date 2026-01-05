import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

// Helper for mentor status
const getMentorStatus = (user) => {
  if (!user || !user.role) return "pending";
  if (user.role !== "mentor") return "approved";
  return user.status || "pending";
};

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  pollingRef: null,
  initialized: false,
  isPremium: false,

  checkAuth: async () => {
    // Alias for fetchUserProfile to serve as the main initialization point
    await get().fetchUserProfile();
  },

  fetchUserProfile: async (force = false) => {
    const { initialized } = get();
    if (initialized && !force) return;

    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      const user = res?.data?.user;

      if (!user) {
        set({
          user: null,
          isAuthenticated: false,
          isPremium: false,
          loading: false,
          initialized: true,
        });
        return;
      }

      user.status = getMentorStatus(user);
      set({
        user,
        isAuthenticated: true,
        isPremium: user?.isPremium || false, // ✅ sync premium status
        loading: false,
        initialized: true,
      });
    } catch (err) {
      console.error("❌ Fetch user failed:", err);
      set({
        user: null,
        isAuthenticated: false,
        isPremium: false,
        error: err.response?.data?.message || "Failed to load user profile",
        loading: false,
        initialized: true,
      });
    }
  },

  // ✅ Signup
  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/signup", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("OTP sent to your email for verification!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Verify OTP
  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/verify-otp", { email, otp }, { withCredentials: true });
      toast.success(res?.data?.message || "OTP verified successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      toast.error(msg);
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Login (sets cookie)
  login: async (values) => {
    set({ loading: true, error: null });
    try {
      // 1. Perform Login (sets cookies)
      await api.post("/auth/login", values, { withCredentials: true });

      // 2. 🔴 Force backend session verification for cookie readiness
      // This ensures we don't proceed until cookies are actually usable
      await get().checkAuth();

      // 3. Get confirmed user from state
      const { user } = get();
      if (!user) throw new Error("Login verification failed");

      // Show role-specific welcome messages (only one toast)
      if (user.role === "admin") {
        toast.success(`Welcome back, Admin ${user.name}!`, { duration: 3000 });
      } else if (user.role === "mentor") {
        toast.success(`Welcome back, ${user.name}!`, { duration: 3000 });
      } else if (user.role === "developer") {
        toast.success(`Welcome back, ${user.name}!`, { duration: 3000 });
      } else {
        toast.success("Login successful!", { duration: 3000 });
      }

      return user;
    } catch (err) {
      console.error("Login flow error:", err);
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      // Ensure we reset state on failure
      set({
        user: null,
        isAuthenticated: false,
        initialized: true, // Mark initialized so we don't get stuck loading
        error: msg,
        loading: false
      });
      throw err;
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      const { stopPolling } = get();
      if (stopPolling) stopPolling();

      set({
        user: null,
        isAuthenticated: false,
        isPremium: false,
        loading: false,
        initialized: false,
      });

      toast.success("Logged out successfully!", { duration: 3000 });
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed:", err);
    }
  },

  // ✅ Mentor polling (for approval updates)
  startPolling: () => {
    const { user, fetchUserProfile, pollingRef } = get();
    if (user?.role === "mentor" && user?.status === "pending" && !pollingRef) {
      const interval = setInterval(fetchUserProfile, 10000);
      set({ pollingRef: interval });
    }
  },

  stopPolling: () => {
    const { pollingRef } = get();
    if (pollingRef) {
      clearInterval(pollingRef);
      set({ pollingRef: null });
    }
  },

  // ✅ Update user manually
  setUser: (user) => {
    if (user) {
      user.status = getMentorStatus(user);
      set({
        user,
        isAuthenticated: true,
        isPremium: user?.isPremium || false,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isPremium: false,
      });
    }
  },
}));

export default useAuthStore;