import React, { useEffect } from "react";
import PremiumBanner from "./PremiumBanner";
import MentorCard from "./MentorCard";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";
import toast from "react-hot-toast";
import Shimmer from "../../../../components/Shimmer";

export default function BookMentorship() {
  const { mentors, loadingMentors, error, fetchMentors } = useMentorshipStore();
  const { user, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    fetchUserProfile(); // Always fetch user profile on mount
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user?._id) fetchMentors();
  }, [fetchMentors, user?._id]);

  // Show toast notification when user is not premium
  useEffect(() => {
    if (user && !user.isPremium && user.role !== "mentor") {
      toast.info("Upgrade to premium to book mentorship sessions", {
        duration: 6000,
        icon: "⭐"
      });
    }
  }, [user]);



  if (!user?._id) {
    return (
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl shadow border">
          <Shimmer type="text" className="h-5 w-32 mx-auto" />
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
              Find Expert Mentors
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              Connect with experienced professionals who can guide your career growth,
              provide technical insights, and help you achieve your development goals
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {mentors?.length || 0} Active Mentors
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Available Mentors
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Browse and connect with our expert mentors
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100">
            <span className="text-sm font-medium">
              {mentors?.length || 0} mentors available
            </span>
          </div>
        </div>
      </div>

      {/* Mentors List - Full Width Cards */}
      {loadingMentors ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-6">
                <Shimmer type="profile" className="w-20 h-20" />
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
      ) : error ? (
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load mentors</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchMentors()}
            className="bg-[#032f60] text-white px-6 py-2 rounded-lg hover:bg-[#032f60]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !mentors?.length ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">No Mentors Available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Currently there are no mentors available. Please check back later or contact support for more information.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <MentorCard mentor={mentor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}