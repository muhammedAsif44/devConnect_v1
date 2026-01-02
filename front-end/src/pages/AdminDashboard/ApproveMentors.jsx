import React from "react";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function ApproveMentors({ data, loading, refresh }) {
  if (loading) return <div>Loading pending mentors...</div>;

  const pending = data?.pendingMentors || [];

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/approve-mentor/${id}`);
      toast.success("Mentor approved");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/reject-mentor/${id}`);
      toast.success("Mentor rejected");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  if (!pending.length) return <div className="bg-white rounded-xl shadow p-6">No pending mentors right now.</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Pending Mentor Approvals</h2>
      <div className="space-y-4">
        {pending.map((m) => (
          <div key={m._id} className="flex items-center justify-between border-b py-3">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-600">{m.email}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => handleApprove(m._id)}>Approve</Button>
              <Button variant="outline" onClick={() => handleReject(m._id)}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
