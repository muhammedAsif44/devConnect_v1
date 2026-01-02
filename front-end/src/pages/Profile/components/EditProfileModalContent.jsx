import React, { useRef } from "react";

export default function EditProfileModalContent({
  form,
  setForm,
  onSave,
  loading,
  onClose,
}) {
  // ✅ Hook must be declared at the top, before any return
  const fileInputRef = useRef(null);

  if (!form) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((f) => ({
      ...f,
      profilePhoto: file,
      previewPhoto: URL.createObjectURL(file),
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-5">
      <h2 className="text-xl font-bold mb-2 text-[#032f60]">Edit Profile</h2>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <img
            src={
              form.previewPhoto ||
              (form.profilePhoto && typeof form.profilePhoto === "string"
                ? form.profilePhoto
                : "/default-avatar.png")
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#032f60]"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-[#032f60] text-white text-sm px-2 py-1 rounded-full"
          >
            Change
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      {/* Name */}
      <input
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Name"
      />

      {/* Location */}
      <input
        value={form.location}
        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Location"
      />

      {/* Bio */}
      <textarea
        value={form.bio}
        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Bio"
        rows={3}
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex-1 px-4 py-2 rounded bg-[#032f60] text-white font-semibold hover:bg-[#021d38]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
