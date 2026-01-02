// src/utils/constants.js
import {
  Home,
  Search,
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Users,
  User,
} from "lucide-react";

// =========================
// 🎨 THEME COLORS
// =========================
export const PRIMARY_COLOR = "#032f60"; // Dark Blue
export const ACCENT_COLOR = "#FFC107";  // Gold / Premium Highlight

// =========================
// 🧭 DEVELOPER DASHBOARD SIDEBAR ITEMS
// =========================
export const sidebarItems = [
  { name: "Home / Feed", slug: "feed", icon: Home },
  { name: "Find Mentors / Developers", slug: "find", icon: Search },
  { name: "Connections", slug: "connections", icon: Users },
  { name: "Book Mentorship", slug: "book", icon: CalendarPlus },
  { name: "My Bookings", slug: "bookings", icon: CalendarCheck },
  { name: "Messages", slug: "messages", icon: MessageSquare },
  { name: "Groups", slug: "groups", icon: Users },
  { name: "Profile", slug: "profile", icon: User },
];

// =========================
// 🎓 MENTOR DASHBOARD SIDEBAR ITEMS
// =========================
export const mentorSidebarItems = [
  { name: "Dashboard", slug: "dashboard" },
  { name: "Connection Requests", slug: "requests" },
  { name: "My Students", slug: "students" },
  { name: "Sessions", slug: "sessions" },
  { name: "Messages", slug: "messages" },
  { name: "Profile", slug: "profile" },
];

// =========================
// 🏷️ TAG COLOR UTILITY
// =========================
const TAG_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-red-100 text-red-800 border-red-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-sky-100 text-sky-800 border-sky-200",
];

export const getTagColor = (index) =>
  TAG_COLORS[index % TAG_COLORS.length];

// =========================
// 🧠 MOCK POST DATA (for Home Feed)
// =========================
export const mockPosts = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior React Developer",
    avatarInitials: "SC",
    timeAgo: "2 hours ago",
    skills: ["React", "TypeScript", "Redux"],
    content:
      "Just finished implementing a complex state management solution using Redux Toolkit — performance improvements are massive! Happy to share insights with anyone working on similar challenges.",
    imageUrl:
      "https://placehold.co/800x400/1e293b/cbd5e1?text=Code+Snippet+Visualization",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    name: "Michael Davis",
    title: "DevOps Engineer",
    avatarInitials: "MD",
    timeAgo: "Yesterday",
    skills: ["Kubernetes", "AWS", "Terraform"],
    content:
      "My team migrated our main microservice to Kubernetes. Took weeks of planning, but the auto-scaling capabilities are a huge win. Never underestimate a clean Terraform config!",
    imageUrl: null,
    likes: 157,
    comments: 41,
    shares: 12,
  },
  {
    id: 3,
    name: "Aisha Khan",
    title: "Data Scientist",
    avatarInitials: "AK",
    timeAgo: "3 days ago",
    skills: ["Python", "Pandas", "Machine Learning"],
    content:
      "Wrote a quick article on cleaning messy datasets using Pandas vectorized ops instead of loops — cuts down processing time dramatically. Link in my profile!",
    imageUrl:
      "https://placehold.co/800x400/004d40/ffffff?text=Data+Science+Graph",
    likes: 88,
    comments: 19,
    shares: 7,
  },
];
