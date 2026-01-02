import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../ZustandStore/useAuthStore";
import PremiumPlansModal from "./PremiumPlansModal";
import toast from "react-hot-toast";

export default function PremiumRoute({ children, onCloseRedirect }) {
  const { user, loading } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.isPremium && user.role !== "mentor") {
      setShowModal(true);
    }
  }, [user, loading]);

  const handleCloseModal = () => {
    setShowModal(false);
    // Call parent callback if provided to navigate back
    if (onCloseRedirect && typeof onCloseRedirect === 'function') {
      onCloseRedirect();
    } else {
      // Fallback: try browser back, otherwise do nothing (user can manually navigate)
      if (window.history.length > 1) {
        window.history.back();
      } else {
        toast.info("Please select a different option or upgrade to premium");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Mentors can always access
  if (user.role === "mentor") return children;

  const isPremiumValid =
    user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

  if (isPremiumValid) return children;

  return (
    <>
      {showModal && (
        <PremiumPlansModal 
          isOpen={showModal} 
          onClose={handleCloseModal}
        />
      )}

      {!showModal && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <h2 className="text-xl font-bold mb-3">Premium Membership Required</h2>
          <p className="text-gray-600 mb-5">
            Upgrade to premium to access mentorship and booking features.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View Premium Plans
          </button>
        </div>
      )}
    </>
  );
}
