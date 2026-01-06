import React, { useState, useEffect } from "react";
import {
  Home,
  Search as SearchIcon,
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Users,
  User,
  Menu,
  X,
} from "lucide-react";

import HomeFeed from "./HomeFeed";
import FindMentorsUsers from "./FindMentorsUsers";
import MyProfilePage from "../Profile/MyProfilePag";
import SidebarLink from "./components/SideBar";
import Header from "./components/Header";
import DeveloperConnections from "./DeveloperConnections";
import BookMentorship from "../DeveloperDashboard/components/MentorshipBooking/BookMentorship";
import MyBookings from "./components/MyBookings/MyBookings";
import ChatPage from "../Chat/ChatPage"; // ✅ NEW IMPORT
import Groups from "./Groups"; // ✅ NEW IMPORT FOR GROUPS
import { PRIMARY_COLOR, sidebarItems } from "../../utils/constants";
import useAuthStore from "../../ZustandStore/useAuthStore";
import { useLocation, useSearchParams } from "react-router-dom";
import PremiumRoute from "../../components/PremiumSubscription/PremiumRoute";

const iconMap = {
  feed: Home,
  find: SearchIcon,
  book: CalendarPlus,
  bookings: CalendarCheck,
  messages: MessageSquare, // ✅ matches ChatPage
  connections: Users,
  profile: User,
};

export default function DeveloperDashboard() {
  const [activeSlug, setActiveSlug] = useState("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { fetchUserProfile, user } = useAuthStore();

  // Check for userId or section in URL query params to auto-open chat or specific section
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const sectionParam = searchParams.get('section');

    if (userIdParam) {
      setActiveSlug('messages');
    } else if (sectionParam && iconMap[sectionParam]) {
      setActiveSlug(sectionParam);
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

  useEffect(() => {
    fetchUserProfile();
  }, [location.pathname, fetchUserProfile]);

  const sidebarItemMap = sidebarItems.map((item) => ({
    ...item,
    icon: iconMap[item.slug] || Home,
  }));

  return (
    <div className="flex h-screen w-screen bg-gray-100 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 pt-8 z-40 overflow-y-auto"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        {/* Logo Section */}
        <div className="flex items-center mb-10 px-6 shrink-0">
          <div className="w-12 h-12 rounded-full bg-white mr-4 flex items-center justify-center shadow-md">
            <span className="font-semibold text-lg" style={{ color: "#043873" }}>
              DC
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            DevConnect
          </h1>
        </div>

        {/* Sidebar Nav */}
        <nav className="space-y-2 px-4 pb-8">
          {sidebarItemMap.map((item) => (
            <SidebarLink
              key={item.slug}
              icon={item.icon}
              name={item.name}
              isActive={activeSlug === item.slug}
              onClick={() => setActiveSlug(item.slug)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 pt-6 z-50 transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <div className="flex justify-between items-center mb-8 px-6 shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white mr-3 flex items-center justify-center shadow-md">
              <span className="font-semibold text-sm" style={{ color: "#043873" }}>
                DC
              </span>
            </div>
            <h1 className="text-xl font-semibold tracking-wide text-white">
              DevConnect
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-blue-900 rounded-lg transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile Sidebar Nav */}
        <nav className="space-y-2 px-4 pb-8">
          {sidebarItemMap.map((item) => (
            <SidebarLink
              key={item.slug}
              icon={item.icon}
              name={item.name}
              isActive={activeSlug === item.slug}
              onClick={() => {
                setActiveSlug(item.slug);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 ml-0 lg:ml-72">
        {/* Mobile Header with Hamburger */}
        {isMobile && (
          <div className="lg:hidden flex items-center bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6" style={{ color: PRIMARY_COLOR }} />
            </button>
          </div>
        )}

        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 min-h-0">
          <div className="p-6">
            {activeSlug === "feed" && <HomeFeed />}
            {activeSlug === "find" && <FindMentorsUsers />}
            {activeSlug === "profile" && <MyProfilePage />}
            {activeSlug === "connections" && <DeveloperConnections />}
            {activeSlug === "groups" && <Groups />}

            {activeSlug === "book" && (
              <PremiumRoute onCloseRedirect={() => setActiveSlug("feed")}>
                <BookMentorship />
              </PremiumRoute>
            )}

            {activeSlug === "bookings" && (
              <PremiumRoute onCloseRedirect={() => setActiveSlug("feed")}>
                <MyBookings />
              </PremiumRoute>
            )}

            {/* ✅ Messages route (Chat) */}
            {activeSlug === "messages" && <ChatPage userId={user?._id} />}

            {/* Fallback */}
            {![
              "feed",
              "find",
              "profile",
              "connections",
              "book",
              "bookings",
              "messages",
              "groups",
            ].includes(activeSlug) && (
                <div
                  className="p-10 text-center bg-white rounded-xl shadow-lg mt-4"
                  style={{ color: "#043873" }}
                >
                  Page Not Found
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
