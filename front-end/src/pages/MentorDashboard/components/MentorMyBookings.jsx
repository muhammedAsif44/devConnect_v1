import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMentorshipStore from "../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../ZustandStore/useAuthStore";
import BookingCard from "../../DeveloperDashboard/components/MyBookings/BookingCard";
import BookingFilter from "../../DeveloperDashboard/components/MyBookings/BookingFilter";
import Shimmer from "../../../components/Shimmer";

export default function MentorMyBookings() {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuthStore();
  const { bookings, loadingBookings, fetchBookings, completeSession, cancelSession } = useMentorshipStore();
  const [filter, setFilter] = useState({ search: "", status: "" });

  const handleChat = (userToChat) => {
    if (userToChat && userToChat._id) {
      // Navigate within mentor dashboard with userId parameter
      navigate(`/mentor-dashboard?userId=${userToChat._id}`);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchBookings(user._id);
  }, [user?._id, fetchBookings]);

  if (!user?._id) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-4 text-center text-gray-500">
          <Shimmer type="text" className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

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

  // Mentor sees all sessions where they are the mentor (API already gives all sessions for this mentor)
  const filtered = bookings
    .filter((session) => !!session)
    .filter((session) => {
      // status filter
      const matchesStatus = !filter.status || session.status === filter.status;
      // search filter
      const search = filter.search?.toLowerCase() || "";
      const menteeName = session.menteeId?.name?.toLowerCase() || session.mentee?.name?.toLowerCase() || "";
      const title = session.title?.toLowerCase() || "";
      const dateString = formatDateForSearch(session.date, session.sessionDate);

      const matchesText =
        !search ||
        title.includes(search) ||
        menteeName.includes(search) ||
        dateString.includes(search);

      return matchesStatus && matchesText;
    })
    // upcoming first
    .sort((a, b) => new Date(a.date || a.sessionDate) - new Date(b.date || b.sessionDate));

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-[#032f60] text-white rounded-xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            My Bookings
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            See your mentorship sessions, status, and past session history
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <BookingFilter filter={filter} setFilter={setFilter} />
        </div>

        {/* Bookings Grid/List */}
        <div className="space-y-6">
          {loadingBookings ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow border">
              <Shimmer type="text" className="h-4 w-32 mx-auto" />
              <p className="mt-2">Loading sessions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-white rounded-xl shadow border">
              <p className="text-lg font-medium">No sessions match your filters.</p>
              <p className="text-sm mt-2">Create a session or adjust your filters to see bookings.</p>
            </div>
          ) : (
            filtered.map((session) => (
              <BookingCard
                key={session._id}
                session={session}
                showMenteeInfo
                showActions
                onComplete={(id) => completeSession(id, user._id)}
                onCancel={(id) => cancelSession(id, user._id)}
                onChat={handleChat}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
