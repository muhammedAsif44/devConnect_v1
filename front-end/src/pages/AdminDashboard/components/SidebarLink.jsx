import React from "react";

// eslint-disable-next-line no-unused-vars
export default function SidebarLink({ name, icon: Icon, isActive, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-white/10"}`}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span>{name}</span>}
    </button>
  );
}
