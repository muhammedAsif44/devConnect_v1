import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";
import BookingCard from "./BookingCard";
import BookingFilter from "./BookingFilter";
import toast from "react-hot-toast";
import Shimmer from "../../../../components/Shimmer";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, initialized, fetchUserProfile } = useAuthStore();
  const { bookings, loadingBookings, fetchBookings } = useMentorshipStore();
  const [filter, setFilter] = useState({ search: "", status: "" });

  const handleChat = (userToChat) => {
    if (userToChat && userToChat._id) {
      // Navigate within developer dashboard with userId parameter
      navigate(`/developer-dashboard?userId=${userToChat._id}`);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Always fetch user profile on mount
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchBookings(user._id);
  }, [user?._id, fetchBookings]);

  // Show toast notification when user is not premium
  useEffect(() => {
    if (user && !user.isPremium && user.role !== "mentor") {
      toast.info("Upgrade to premium to access all booking features", {
        duration: 6000,
        icon: "⭐"
      });
    }
  }, [user]);



  // ✅ Convert date safely
  const formatDateForSearch = (dateValue, altValue) => {
    const value = dateValue || altValue;
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date)) return "";
      return date
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
        .toLowerCase();
    } catch {
      return "";
    }
  };


  const filtered = bookings
    .filter((session) => !!session)
    .filter((session) => {
      const matchesStatus =
        !filter.status || session.status === filter.status;

      const search = filter.search?.toLowerCase() || "";
      const mentorName =
        session.mentorId?.name?.toLowerCase() ||
        session.mentor?.name?.toLowerCase() ||
        "";
      const title = session.title?.toLowerCase() || "";
      const dateString = formatDateForSearch(session.date, session.sessionDate); // <-- FIXED

      const matchesText =
        !search ||
        title.includes(search) ||
        mentorName.includes(search) ||
        dateString.includes(search);

      return matchesStatus && matchesText;
    })
    // ✅ Sort by upcoming date
    .sort((a, b) => new Date(a.date || a.sessionDate) - new Date(b.date || b.sessionDate));

  if (!user?._id) {
    return (
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
          <Shimmer type="text" className="h-5 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-8 px-4">
      {/* Premium Banner Section */}
      <div className="bg-[#032f60] text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              My Bookings
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              Manage your mentorship sessions, track upcoming meetings, and view your session history all in one place
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {filtered.length} Total Sessions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Session Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Filter and manage your mentorship sessions
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100">
            <span className="text-sm font-medium">
              {filtered.length} sessions found
            </span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <BookingFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* Content Section */}
      {loadingBookings ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-6">
                <Shimmer type="profile" />
                <div className="flex-1">
                  <Shimmer type="text" className="w-1/3 mb-3" />
                  <Shimmer type="text" className="w-1/4 mb-2" />
                  <Shimmer type="line" className="w-2/3 mb-3" />
                  <div className="flex gap-2">
                    <Shimmer type="button" className="w-20 h-6" />
                    <Shimmer type="button" className="w-20 h-6" />
                  </div>
                </div>
                <Shimmer type="button" className="w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {filter.search || filter.status ? "No matching sessions found" : "No bookings yet"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter.search || filter.status
              ? "Try adjusting your search or filter criteria to find your sessions."
              : "Book your first mentorship session to get started with personalized guidance."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((session) => (
            <div key={session._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <BookingCard session={session} onChat={handleChat} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}