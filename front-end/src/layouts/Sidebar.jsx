import React from "react";
import useAuthStore from "../ZustandStore/useAuthStore";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ items, activeSlug, setActiveSlug, header = "Dashboard", className = "" }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setActiveSlug("profile");
  };

  return (
    <aside className={`w-64 bg-[#032f60] text-white flex flex-col py-8 shadow-lg ${className}`}>
      {/* Top Section - Navigation Items */}
      <div className="mb-10 px-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-8">{header}</h1>
        {items.map(item => (
          <button
            key={item.slug}
            className={`block w-full text-left px-4 py-3 rounded-lg mb-1 transition ${
              activeSlug === item.slug
                ? "bg-white text-[#032f60] font-semibold"
                : "hover:bg-blue-900 hover:text-white"
            }`}
            onClick={() => setActiveSlug(item.slug)}
          >
            {item.icon && <item.icon className="inline-block mr-2 w-5 h-5" />}
            {item.name}
          </button>
        ))}
      </div>

      {/* Bottom Section - User Profile & Logout */}
      <div className="px-6 pt-6 border-t border-blue-900 space-y-3">
        {user && (
          <div className="mb-4 p-4 bg-blue-900 rounded-lg">
            <p className="text-xs text-blue-200 mb-1">Logged in as</p>
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-blue-200 capitalize">{user.role}</p>
          </div>
        )}

        <button
          onClick={handleProfileClick}
          className="w-full px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 transition flex items-center gap-2 text-sm font-medium"
        >
          <User className="w-4 h-4" />
          View Profile
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
