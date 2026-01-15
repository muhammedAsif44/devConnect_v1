

import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useMentorshipStore = create((set, get) => ({
  mentors: [],
  bookings: [],
  loadingMentors: false,
  loadingBookings: false,
  bookingSessionLoading: false,
  error: null,

  // ✅ Fetch mentor list from backend
  fetchMentors: async () => {
    set({ loadingMentors: true, error: null });
    try {
      const res = await api.get("/mentors", { withCredentials: true });
      set({ mentors: res.data.mentors || [], loadingMentors: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load mentors",
        loadingMentors: false,
      });
      toast.error("Mentor fetch failed");
    }
  },



  bookSession: async (mentorId, menteeId, availabilityId, slotTime, date, slotId) => {
    set({ bookingSessionLoading: true, error: null });
    try {
      const payload = {
        mentorId,
        menteeId,
        availabilityId,
        slot: slotTime,
        date,
        slotId,
        sessionType: 'one-on-one',
      };


      const res = await api.post("/sessions", payload, { withCredentials: true });
      // toast.success("Session booked!");

      const updatedMentors = get().mentors.map((mentor) => {
        if (String(mentor._id) === String(mentorId)) {
          const updatedAvailability = mentor.mentorProfile.availability.map((a) =>
            String(a._id) === String(availabilityId)
              ? {
                ...a,
                slots: a.slots.map((s) => {
                  const isTarget = slotId ? String(s._id) === String(slotId) : String(s.time) === String(slotTime);
                  return isTarget ? { ...s, isBooked: true, bookedBy: menteeId } : s;
                }),
              }
              : a
          );
          return {
            ...mentor,
            mentorProfile: {
              ...mentor.mentorProfile,
              availability: updatedAvailability,
            },
          };
        }
        return mentor;
      });

      set({ mentors: updatedMentors });

      //   Refresh bookings for current user
      if (menteeId) await get().fetchBookings(menteeId);

      set({ bookingSessionLoading: false });
      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Could not book session";

      // If already booked (409), reflect state locally so UI greys out
      if (status === 409) {
        const updatedMentors = get().mentors.map((mentor) => {
          if (String(mentor._id) === String(mentorId)) {
            const updatedAvailability = mentor.mentorProfile.availability.map((a) =>
              String(a._id) === String(availabilityId)
                ? {
                  ...a,
                  slots: a.slots.map((s) => {
                    const isTarget = slotId ? String(s._id) === String(slotId) : String(s.time) === String(slotTime);
                    return isTarget ? { ...s, isBooked: true } : s;
                  }),
                }
                : a
            );
            return {
              ...mentor,
              mentorProfile: { ...mentor.mentorProfile, availability: updatedAvailability },
            };
          }
          return mentor;
        });
        set({ mentors: updatedMentors, bookingSessionLoading: false, error: message });
        // toast.error(message);
        return; // do not throw
      }

      set({ error: message, bookingSessionLoading: false });
      // toast.error("Booking failed");
      throw err;
    }
  },

  // ✅ Fetch sessions for current user
  fetchBookings: async (userId) => {

    set({ loadingBookings: true, error: null });
    try {
      const res = await api.get(`/sessions/${userId}`, { withCredentials: true });
      set({ bookings: res.data.sessions || [], loadingBookings: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Could not fetch bookings",
        loadingBookings: false,
      });
      toast.error("Failed to load bookings");
    }
  },

  // ✅ Complete a session (mentor/admin)
  completeSession: async (sessionId, userIdForRefresh) => {
    try {
      await api.patch(`/sessions/${sessionId}/complete`, {}, { withCredentials: true });
      toast.success("Session marked as completed");

      // Update local bookings without full refresh
      const updatedBookings = get().bookings.map(booking =>
        booking._id === sessionId ? { ...booking, status: 'completed' } : booking
      );
      set({ bookings: updatedBookings });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not complete session");
      throw err;
    }
  },

  // ✅ Cancel a session (mentor/admin)
  cancelSession: async (sessionId, userIdForRefresh) => {
    try {
      await api.patch(`/sessions/${sessionId}/cancel`, {}, { withCredentials: true });
      toast.success("Session cancelled");

      // Update local bookings without full refresh
      const updatedBookings = get().bookings.map(booking =>
        booking._id === sessionId ? { ...booking, status: 'cancelled' } : booking
      );
      set({ bookings: updatedBookings });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel session");
      throw err;
    }
  },
}));

export default useMentorshipStore;
