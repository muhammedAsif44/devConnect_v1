import React, { useState } from "react";
import TableCard from "./components/UserTable";
import Modal from "./components/Modal";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function UsersSection({ data, loading, refresh, query }) {
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const [modalError, setModalError] = useState("");

  if (loading) return <div>Loading users...</div>;

  const handleEditSave = async () => {
    setModalError("");
    if (!editForm.name.trim()) return setModalError("Name cannot be empty");

    try {
      const res = await api.put(
        `/admin/users/${editUser._id}`,
        editForm,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("User updated");
        setEditUser(null);
        refresh(query);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    setModalError("");
    try {
      const res = await api.delete(
        `/admin/users/${deleteUser._id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("User deleted");
        setDeleteUser(null);
        refresh(query);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refresh({ ...query, search: e.target.search.value, page: 1 });
  };

  const handleRoleChange = (e) => {
    refresh({ ...query, role: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    refresh({ ...query, page: newPage });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Manage Users & Mentors</h2>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            name="search"
            defaultValue={query.search || ""}
            placeholder="Search users..."
            className="border px-3 py-2 rounded-md"
          />
          <Button type="submit">Search</Button>
        </form>

        <select
          value={query.role || "all"}
          onChange={handleRoleChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="all">All Roles</option>
          <option value="developer">Developer</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <TableCard
        users={data?.users || []}
        onEdit={(user) => {
          setEditUser(user);
          setEditForm({ name: user.name, role: user.role });
          setModalError("");
        }}
        onDelete={(user) => {
          setDeleteUser(user);
          setModalError("");
        }}
      />

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={query.page <= 1}
          onClick={() => handlePageChange(query.page - 1)}
        >
          Prev
        </Button>
        <span className="font-medium">
          Page {query.page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={query.page >= totalPages}
          onClick={() => handlePageChange(query.page + 1)}
        >
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" onConfirm={handleEditSave} confirmText="Save Changes">
        {modalError && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">{modalError}</p>}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <label className="block text-sm font-medium mt-2">Role</label>
          <select
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="developer">Developer</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User"
        onConfirm={handleDelete}
        confirmText="Delete"
        isDanger
      >
        {modalError && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">{modalError}</p>}
        <p>Are you sure you want to delete <strong>{deleteUser?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
