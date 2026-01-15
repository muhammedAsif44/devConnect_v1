import { useState, useEffect } from "react";
import api from "../api/axios";

export const useBookedUsers = (userId) => {
  const [bookedUsers, setBookedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchBookedUsers = async () => {
      setLoading(true);
      setError(null);
      try {

        // Get all sessions where this mentor received bookings
        const res = await api.get(`/sessions/booked-users/${userId}`, {
          withCredentials: true,
        });

        setBookedUsers(res.data.users || []);
      } catch (err) {
        console.error("❌ Failed to fetch booked users:", err);
        setError(err.response?.data?.message || "Failed to fetch booked users");
        setBookedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedUsers();
  }, [userId]);

  return { bookedUsers, loading, error };
};
