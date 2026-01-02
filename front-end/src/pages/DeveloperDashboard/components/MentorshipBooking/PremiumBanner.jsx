import React from "react";

export default function PremiumBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded px-8 py-7 mb-5">
      <div className="font-bold text-lg text-gray-800 mb-2">Premium Feature</div>
      <div className="text-gray-700 mb-3">
        Mentorship booking is exclusively available for Premium members. Upgrade now to unlock unlimited sessions.
      </div>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded shadow">
        Unlock with Premium - ₹499/month
      </button>
    </div>
  );
}
