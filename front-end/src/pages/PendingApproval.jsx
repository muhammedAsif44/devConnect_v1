import React from "react";
import useAuthStore from "../ZustandStore/useAuthStore";

export default function PendingApproval() {
  const { user, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  const pending = user.status === "pending";
  const rejected = user.status === "rejected";

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {pending ? "Application Pending" : rejected ? "Application Rejected" : "Status Unknown"}
        </h2>
        <p className="text-gray-700 mb-6">
          {pending
            ? "Thanks for applying as a mentor! Your profile is pending admin approval. You cannot access the mentor dashboard yet."
            : rejected
            ? "Unfortunately, your mentor application was rejected. Contact support for clarification."
            : "We could not determine your status. Please contact support."}
        </p>
        {rejected && (
          <a
            href="mailto:support@devconnect.com"
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Contact Support
          </a>
        )}
      </div>
    </div>
  );
}
