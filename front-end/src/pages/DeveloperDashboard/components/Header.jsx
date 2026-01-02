import React, { useState, useEffect } from "react";
import { Search as SearchIcon, Bell, ChevronDown, LogOut, Award, Star } from "lucide-react";
import Button from "../../../components/Button";
import PremiumBadge from "../../../components/shared/PremiumBadge";
import MentorBadge from "../../../components/shared/MentorBadge";
import useAuthStore from "../../../ZustandStore/useAuthStore";
import toast from "react-hot-toast";
import PremiumPlansModal from "../../../components/PremiumSubscription/PremiumPlansModal";

export default function Header() {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Show toast notification when user is not premium
  useEffect(() => {
    if (user && !user.isPremium && user.role !== "mentor") {
      toast.success("Upgrade to premium for exclusive features", {
        duration: 6000,
        icon: "⭐"
      });
    }
  }, [user]);

  return (
    <>
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm flex-shrink-0">
        {/* 🔍 Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative group w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search developers, mentors, or skills..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm"
              style={{ color: "#043873" }}
            />
          </div>
        </div>

        {/* 🔔 Right Section */}
        <div className="flex items-center ml-auto space-x-6">

          {/* ⭐ Premium Button or Badge */}
          {!user?.isPremium ? (
            <Button
              variant="accent"
              onClick={() => setIsPremiumModalOpen(true)} // ✅ Open modal
              className="text-sm font-medium px-5 py-2 rounded-full flex items-center"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FFCC33)",
                color: "#1a1a1a",
              }}
            >
              <Award className="w-4 h-4 mr-2 text-[#7a5c00]" /> Use Premium
            </Button>
          ) : (
            <div className="flex items-center bg-yellow-400 text-[#1a1a1a] px-4 py-2 rounded-full font-semibold shadow-sm">
              <Star className="w-4 h-4 mr-2" />
              Premium User
            </div>
          )}

          {/* 🔔 Notification Bell */}
          <div className="relative cursor-pointer p-3 rounded-full hover:bg-sky-100 transition-all flex items-center justify-center shadow-md">
            <Bell className="w-6 h-6 text-sky-600" />
            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ring-2 ring-white">
              5
            </span>
          </div>

          {/* 👤 User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-full hover:bg-sky-100"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                )}
              </div>
              <span
                className="lg:inline font-medium flex items-center gap-2"
                style={{ color: "#043873" }}
              >
                {user?.name || "User"}
                <PremiumBadge user={user} variant="small" />
                <MentorBadge user={user} variant="small" />
              </span>
              <ChevronDown
                className={`w-4 h-4 text-sky-600 transition-transform hidden lg:inline ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-sky-100 rounded-xl shadow-lg z-30">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🪄 Premium Modal */}
      <PremiumPlansModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
}