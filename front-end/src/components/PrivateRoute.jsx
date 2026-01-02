// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import useAuthStore from "../ZustandStore/useAuthStore";
// import toast from "react-hot-toast";

// export default function PrivateRoute({ children, role }) {
//   const { user, isAuthenticated, loading, fetchUserProfile, initialized } = useAuthStore();

//   useEffect(() => {
//     if (!initialized) {
//       fetchUserProfile();
//     }
//     // eslint-disable-next-line
//   }, []);

//   // **This order is critical**
//   if (!loading && initialized && !isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   if (loading || !initialized) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }

//   if (role && ![role].flat().includes(user?.role)) {
//     toast.error("Access denied");
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role === "mentor" && ["pending", "rejected"].includes(user.status)) {
//     return <Navigate to="/pending-approval" replace />;
//   }

//   return children;
// }

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../ZustandStore/useAuthStore";
import toast from "react-hot-toast";

export default function PrivateRoute({ children, role }) {
  const { user, isAuthenticated, loading, fetchUserProfile, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  // If we've initialized and determined not authenticated, redirect immediately
  if (!loading && initialized && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Loading gate
  if (loading || !initialized) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (role && user && ![role].flat().includes(user.role)) {
    toast.error("Access denied");
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "mentor" && ["pending", "rejected"].includes(user.status)) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}