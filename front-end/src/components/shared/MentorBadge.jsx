import React from "react";
import { CheckCircle, GraduationCap } from "lucide-react";

/**
 * MentorBadge Component
 * 
 * Displays a mentor badge for users with mentor role
 * 
 * @param {Object} props
 * @param {Object} props.user - User object with role
 * @param {String} props.variant - Badge variant: 'default', 'small', 'large'
 * @param {String} props.className - Additional CSS classes
 */
export default function MentorBadge({ user, variant = "default", className = "" }) {
  // Check if user is a mentor
  if (!user || user.role !== "mentor") return null;

  // Variant styles
  const variants = {
    small: "px-2 py-0.5 text-xs gap-1",
    default: "px-2.5 py-1 text-xs gap-1.5",
    large: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    small: 12,
    default: 14,
    large: 16,
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all ${variants[variant]} ${className}`}
      title="Verified Mentor"
    >
      <GraduationCap size={iconSizes[variant]} className="flex-shrink-0" />
      <span>Mentor</span>
    </span>
  );
}

