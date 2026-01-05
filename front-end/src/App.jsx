import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import DeveloperDashboard from "./pages/DeveloperDashboard/Index";
import MentorDashboard from "./pages/MentorDashboard/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import PendingApproval from "./pages/PendingApproval";
import ProfilePage from "./pages/Profile/ProfilePage";

import useAuthStore from "./ZustandStore/useAuthStore";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#032f60',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
          },
        }}
      />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/landingpage" replace />} />

        {/* Public routes */}
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Pending Approval */}
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* Protected Dashboards */}
        <Route
          path="/developer-dashboard"
          element={
            <PrivateRoute role="developer">
              <DeveloperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <PrivateRoute role="mentor">
              <MentorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute role={["developer", "mentor"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;