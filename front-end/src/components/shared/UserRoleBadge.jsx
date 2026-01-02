// src/components/shared/UserRoleBadge.jsx

import React from "react";

export default function UserRoleBadge({ role, size = "default" }) {
  if (!role) return null;
  let color = "bg-gray-400";
  if (role === "mentor") color = "bg-blue-600";
  if (role === "admin") color = "bg-red-600";
  if (role === "developer") color = "bg-green-600";
  
  const sizeClasses = {
    small: "text-[10px] px-1.5 py-0.5",
    default: "text-xs px-2 py-0.5",
    large: "text-sm px-2.5 py-1"
  };
  
  return (
    <span className={`${color} text-white ${sizeClasses[size]} font-semibold rounded-full uppercase`}>
      {role}
    </span>
  );
}
