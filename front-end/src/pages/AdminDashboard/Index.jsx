import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  ShieldCheck,
  Bell,
  BarChart2,
  DollarSign,
  Settings,
  ChevronDown,
  LogOut,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import Modal from "./components/Modal";
import StatCard from "./components/StatCard";
import Button from "../../components/Button";
import ContentModeration from "./ContentModeration";
import Payments from "./Payments";
import DashboardOverview from "./DashboardOverview";
import api from "../../api/axios";
import useAuthStore from "../../ZustandStore/useAuthStore";
import toast, { Toaster } from "react-hot-toast";

function TableCard({
  users,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-lg">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="developer">Developer</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages || 1}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout: authLogout, loading } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [modalError, setModalError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0, limit: 10 });

  const logout = async () => {
    try {
      await authLogout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  // Fetch dashboard stats
  useEffect(() => {
    if (activeTab === "dashboard") {
      api.get("/admin/dashboard-stats")
        .then(res => setDashboardData(res.data))
        .catch(() => toast.error("Failed to load dashboard data"));
    }
  }, [activeTab]);

  // Fetch users
  useEffect(() => {
    if (activeTab === "users") {
      const fetchUsers = async () => {
        try {
          const params = { page: currentPage, limit: pagination.limit };
          if (filterRole !== "all") params.role = filterRole;
          if (searchTerm) params.search = searchTerm;
          const res = await api.get("/admin/users", { params, withCredentials: true });
          setUsers(res.data.users || []);
          setPagination({
            ...pagination,
            totalPages: res.data.totalPages || 1,
            total: res.data.total || 0,
          });
        } catch {
          toast.error("Failed to load users");
        }
      };
      fetchUsers();
    }
  }, [activeTab, currentPage, pagination.limit, filterRole, searchTerm]);

  // Fetch pending mentors
  useEffect(() => {
    if (activeTab === "approveMentors") {
      const fetchMentors = async () => {
        try {
          const res = await api.get("/admin/pending-mentors");
          setPendingMentors(res.data || []);
        } catch {
          toast.error("Failed to fetch pending mentors");
        }
      };
      fetchMentors();
    }
  }, [activeTab]);

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      await api.put(`/admin/users/${editUser._id}`, editForm, { withCredentials: true });
      const refreshRes = await api.get("/admin/users", {
        params: { page: currentPage, limit: pagination.limit },
        withCredentials: true,
      });
      setUsers(refreshRes.data.users || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: refreshRes.data.totalPages || 1,
        total: refreshRes.data.total || 0,
      }));
      setEditUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      setModalError(error.response?.data?.message || "Failed to update user");
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    try {
      await api.delete(`/admin/users/${deleteUser._id}`, { withCredentials: true });
      const refreshRes = await api.get("/admin/users", {
        params: { page: currentPage, limit: pagination.limit },
        withCredentials: true,
      });
      setUsers(refreshRes.data.users || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: refreshRes.data.totalPages || 1,
        total: refreshRes.data.total || 0,
      }));
      setDeleteUser(null);
      toast.success("User deleted 🗑️");
    } catch (error) {
      setModalError(error.response?.data?.message || "Failed to delete user");
      toast.error("Failed to delete user");
    }
  };

  const handleApproveMentor = async (id) => {
    try {
      await api.put(`/admin/approve-mentor/${id}`, {}, { withCredentials: true });
      setPendingMentors((prev) => prev.filter((m) => m._id !== id));
      toast.success("Mentor approved ✅");
    } catch {
      toast.error("Failed to approve mentor");
    }
  };

  const handleRejectMentor = async (id) => {
    try {
      await api.put(`/admin/reject-mentor/${id}`, {}, { withCredentials: true });
      setPendingMentors((prev) => prev.filter((m) => m._id !== id));
      toast.success("Mentor rejected ❌");
    } catch {
      toast.error("Failed to reject mentor");
    }
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Users & Mentors", icon: Users, tab: "users" },
    { name: "Approve Mentors", icon: CheckCircle, tab: "approveMentors" },
    { name: "Content Moderation", icon: ShieldCheck, tab: "content" },
    { name: "Notifications", icon: Bell, tab: "notifications" },
    { name: "Payments", icon: DollarSign, tab: "payments" },
  ];

  if (loading || !user)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#032f60',
            color: '#fff',
          },
          success: {
            style: {
              background: '#032f60',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
        containerStyle={{
          top: '80px',
          right: '20px',
          zIndex: 9999,
        }}
      />
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-linear-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-xl`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarExpanded && <h1 className="text-xl font-bold">DevConnect</h1>}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 hover:bg-slate-700 rounded-lg"
          >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all font-medium text-sm ${
                activeTab === item.tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <item.icon size={20} />
              {sidebarExpanded && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors font-medium text-sm">
            <Settings size={20} />
            {sidebarExpanded && <span>Settings</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === "dashboard"
              ? "Dashboard Overview"
              : activeTab === "users"
              ? "Manage Users & Mentors"
              : activeTab === "approveMentors"
              ? "Approve Mentors"
              : activeTab === "content"
              ? "Content Moderation"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="flex items-center gap-4 relative">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 bg-blue-600 text-white rounded-full px-3 py-1 font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>{user?.name || "Admin"}</span>
                <ChevronDown size={16} />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardOverview dashboardData={dashboardData} />}

          {activeTab === "users" && (
            <TableCard
              users={users}
              onEdit={(user) => {
                setEditUser(user);
                setEditForm({ name: user.name, email: user.email || "", role: user.role });
                setModalError("");
              }}
              onDelete={(user) => {
                setDeleteUser(user);
                setModalError("");
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={pagination.totalPages}
            />
          )}

          {activeTab === "approveMentors" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pending Mentor Approvals</h3>
              <div className="grid gap-4">
                {pendingMentors.length > 0 ? (
                  pendingMentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-gray-500">{mentor.email}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={() => handleApproveMentor(mentor._id)} variant="success">
                          Approve
                        </Button>
                        <Button onClick={() => handleRejectMentor(mentor._id)} variant="danger">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No mentors pending approval.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "content" && <ContentModeration />}

          {activeTab === "payments" && <Payments />}
        </main>
      </div>
      <Modal 
        isOpen={!!editUser}
        title="Edit User" 
        onClose={() => {
          setEditUser(null);
          setModalError("");
        }}
        onConfirm={handleEditSave}
        confirmText="Save Changes"
      >
          {modalError && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">{modalError}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="User Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="developer">Developer</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
      </Modal>
      <Modal 
        isOpen={!!deleteUser}
        title="Delete User" 
        onClose={() => {
          setDeleteUser(null);
          setModalError("");
        }}
        onConfirm={handleDeleteUser}
        confirmText="Delete"
        isDanger
      >
          {modalError && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">{modalError}</p>}
          <p>Are you sure you want to delete user <strong>{deleteUser?.name}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}