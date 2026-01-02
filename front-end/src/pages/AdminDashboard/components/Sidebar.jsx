import React from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle
} from "lucide-react";
import SidebarLink from "./SidebarLink";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const ToggleIcon = collapsed ? ChevronRight : ChevronLeft;

  const items = [
    { name: "Dashboard", tab: "dashboard", icon: LayoutDashboard },
    { name: "Users & Mentors", tab: "users", icon: Users },
    { name: "Approve Mentors", tab: "approveMentors", icon: CheckCircle },
  ];

  return (
    <aside className={`hidden md:flex flex-col ${collapsed ? "w-20" : "w-72"} h-screen sticky top-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300`}>
      <div className={`flex items-center gap-3 p-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <span className="text-slate-900 font-bold">AD</span>
        </div>
        {!collapsed && <h3 className="text-lg font-semibold">Admin</h3>}
      </div>

      <nav className="p-4 flex-1 space-y-2">
        {items.map(i => (
          <SidebarLink
            key={i.tab}
            name={i.name}
            icon={i.icon}
            isActive={activeTab === i.tab}
            onClick={() => setActiveTab(i.tab)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(v => !v)}
          className="w-full p-2 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center">
          <ToggleIcon />
        </button>
      </div>
    </aside>
  );
}
