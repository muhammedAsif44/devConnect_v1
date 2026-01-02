/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import useAuthStore from "../ZustandStore/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Header({ title = "Dashboard" }) {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Show toast notification for premium upgrade
  useEffect(() => {
    if (user && !user.isPremium && user.role !== "mentor") {
      toast.info("Upgrade to premium for exclusive features", {
        duration: 6000,
        icon: "⭐"
      });
    }
  }, [user]);

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-20">
      <div>
        <h2 className="text-2xl font-bold text-[#032f60]">{title}</h2>
      </div>

      <div className="flex items-center space-x-6 relative">
        {/* Notification Icon */}
        <button className="relative p-2 rounded-full hover:bg-blue-100 transition">
          <Bell className="w-6 h-6 text-[#032f60]" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            3
          </span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 bg-blue-50 p-2 rounded-full cursor-pointer"
          >
            <img
              src={user?.profilePhoto || "/default-avatar.png"}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#032f60]"
            />
            <span className="font-semibold text-[#032f60]">{user?.name || "User"}</span>
            <ChevronDown className="w-4 h-4 text-[#032f60]" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-30">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}