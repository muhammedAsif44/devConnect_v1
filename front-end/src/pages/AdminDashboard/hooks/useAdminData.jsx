// hooks/useAdminData.js
import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export function useAdminData(activeTab, currentPage, paginationLimit, filterRole, searchTerm) {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [error, setError] = useState(null);

  // Dashboard stats
  useEffect(() => {
    if (activeTab === "dashboard") {
      api.get("/admin/dashboard-stats")
        .then(res => { setDashboardData(res.data); setError(null); })
        .catch(() => setError("Failed to load dashboard data"));
    }
  }, [activeTab]);

  // Users
  useEffect(() => {
    if (activeTab !== "users") return;
    const fetchUsers = async () => {
      try {
        const params = { page: currentPage, limit: paginationLimit };
        if (filterRole !== "all") params.role = filterRole;
        if (searchTerm) params.search = searchTerm;
        const res = await api.get("/admin/users", { params });
        setUsers(res.data.users || []);
      } catch {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, [activeTab, currentPage, paginationLimit, filterRole, searchTerm]);

  // Pending mentors
  useEffect(() => {
    if (activeTab !== "approveMentors") return;
    const fetchMentors = async () => {
      try {
        const res = await api.get("/admin/pending-mentors");
        setPendingMentors(res.data || []);
      } catch {
        toast.error("Failed to fetch pending mentors");
      }
    };
    fetchMentors();
  }, [activeTab]);

  return { dashboardData, users, pendingMentors, error };
}
