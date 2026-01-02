import React from "react";
import { Award } from "lucide-react";

/**
 * PremiumBadge Component
 * 
 * Displays a premium badge for users with active premium membership
 * 
 * @param {Object} props
 * @param {Object} props.user - User object with isPremium and premiumExpiresAt
 * @param {String} props.variant - Badge variant: 'default', 'small', 'large'
 * @param {String} props.className - Additional CSS classes
 */
export default function PremiumBadge({ user, variant = "default", className = "" }) {
  // Check if user has valid premium
  if (!user) return null;

  const isPremiumValid = user.isPremium && 
    (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

  if (!isPremiumValid) return null;

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
      className={`inline-flex items-center font-semibold rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-md hover:shadow-lg transition-all ${variants[variant]} ${className}`}
      title="Premium Member"
    >
      <Award size={iconSizes[variant]} className="flex-shrink-0" />
      <span>Premium</span>
    </span>
  );
}

