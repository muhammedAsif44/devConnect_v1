import React, { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../ZustandStore/useAuthStore"; // ✅ Zustand
import { Menu, X } from "lucide-react";

import PendingApproval from "../PendingApproval";
import Sidebar from "../../layouts/Sidebar";
import Header from "../../layouts/Header";
import HomeFeed from "../DeveloperDashboard/HomeFeed";
import MyProfilePage from "../Profile/MyProfilePag";
import MentorConnections from "../MentorDashboard/MentorConnections";
import MentorMyBookings from "./components/MentorMyBookings";
import MentorMessages from "./MentorMessages";

import {
  Home,
  Calendar,
  BookOpen,
  MessageSquare,
  Users,
  User,
  DollarSign,
} from "lucide-react";

const sidebarItems = [
  { name: "Home / Feed", slug: "home", icon: Home },
  { name: "Availability", slug: "availability", icon: Calendar },
  { name: "My Bookings", slug: "bookings", icon: BookOpen },
  { name: "Messages", slug: "messages", icon: MessageSquare },
  { name: "Connection Requests", slug: "connections", icon: Users },
  { name: "Profile", slug: "profile", icon: User },
  { name: "Earnings", slug: "earnings", icon: DollarSign },
];

export default function MentorDashboard() {
  const { user } = useAuthStore(); // ✅ Zustand
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchParams] = useSearchParams();

  // Check for userId in URL query params to auto-open chat
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setActiveTab('messages');
    }
  }, [searchParams]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // ✅ Handle user not found
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Handle pending/rejected mentor status
  if (user.role === "mentor" && user.status !== "approved") {
    return <PendingApproval />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          items={sidebarItems}
          activeSlug={activeTab}
          setActiveSlug={setActiveTab}
          header="Mentor Panel"
        />
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Drawer */}
      {isMobile && (
        <div
          className={`fixed left-0 top-0 bottom-0 w-64 bg-[#032f60] text-white z-50 transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-blue-900 shrink-0">
            <h1 className="text-2xl font-semibold">Mentor Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-blue-900 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-6 space-y-2 pb-8">
            {sidebarItems.map(item => (
              <button
                key={item.slug}
                className={`block w-full text-left px-4 py-3 rounded-lg mb-1 transition ${activeTab === item.slug
                    ? "bg-white text-[#032f60] font-semibold"
                    : "hover:bg-blue-900 hover:text-white"
                  }`}
                onClick={() => {
                  setActiveTab(item.slug);
                  setSidebarOpen(false);
                }}
              >
                {item.icon && <item.icon className="inline-block mr-2 w-5 h-5" />}
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        {isMobile && (
          <div className="md:hidden flex items-center bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6 text-[#032f60]" />
            </button>
          </div>
        )}

        <Header title="Mentor Dashboard" />

        <main className="flex-1 overflow-y-auto px-8 py-10">
          {activeTab === "home" && <HomeFeed />}
          {activeTab === "profile" && <MyProfilePage />}
          {activeTab === "availability" && (
            <div>Set up your available sessions schedule here.</div>
          )}
          {activeTab === "bookings" && <MentorMyBookings />}
          {activeTab === "messages" && <MentorMessages />}
          {activeTab === "connections" && <MentorConnections />}
          {activeTab === "earnings" && <div>Your earnings analytics here.</div>}
        </main>
      </div>
    </div>
  );
}