/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuthStore  from "../../ZustandStore/useAuthStore";
import { getUserProfile, updateUserProfile } from "../../api/users";
import PostCard from "../DeveloperDashboard/components/postcard/PostCard";
import Modal from "../DeveloperDashboard/components/Modal";
import EditProfileModalContent from "./components/EditProfileModalContent";
import ProfileAvatar from "../../components/ProfileAvatar/ProfileAvatar";

const HEADER_COLOR = "#032f60";

export default function MyProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState(user || null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // load latest profile
  useEffect(() => {
    if (!user) return;
    setProfile(user);
    getUserProfile(user._id).then(setProfile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const updated = await updateUserProfile(user._id, form);
      setUser(updated);
      setEditOpen(false);
      const fresh = await getUserProfile(user._id);
      setProfile(fresh);
      toast.success("Profile updated successfully ✅");
    } catch (err) {
      toast.error("Failed to save changes ❌");
    } finally {
      setSaving(false);
    }
  };

  function daysAgo(dateStr) {
    if (!dateStr) return "";
    const created = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? "" : diffDays;
  }

  if (!profile)
    return (
      <div className="p-10 text-center text-xl text-[#032f60] font-semibold">
        Loading...
      </div>
    );

  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => setEditOpen(true)}
          className="rounded bg-[#032f60] text-white px-4 py-2 hover:bg-[#021d38] font-semibold"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Top */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#032f60] to-blue-800 shadow mb-10 h-56 text-white">
        <div className="absolute left-8 -bottom-16">
          <ProfileAvatar
            photo={profile.profilePhoto}
            name={profile.name}
            className="w-36 h-36 border-4 border-white"
          />
        </div>
        <div className="pl-56 flex items-end justify-between h-full">
          <div className="pt-14 pb-6">
            <div className="font-extrabold text-3xl mb-1">{profile.name}</div>
            <div className="text-lg font-medium opacity-90">
              @{profile.username || profile.email}
            </div>
            <div className="mt-2 text-xs text-gray-200 italic">
              {profile.createdAt
                ? daysAgo(profile.createdAt) === 0
                  ? "Joined today 🎉"
                  : `Joined ${daysAgo(profile.createdAt)} days ago`
                : ""}
            </div>
          </div>
          <div className="flex gap-12 pr-10 pb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.followersCount}</div>
              <div className="text-sm opacity-90">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.followingCount}</div>
              <div className="text-sm opacity-90">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.postsCount}</div>
              <div className="text-sm opacity-90">Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mb-6 bg-white rounded-2xl shadow px-8 py-6">
        <div className="font-bold text-lg text-[#032f60] mb-1">About</div>
        <div className="text-gray-800">
          {profile.bio || (
            <span className="text-gray-400">No bio provided.</span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6 bg-white rounded-2xl shadow px-8 py-6">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg text-[#032f60]">
            Skills & Technologies
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-[#032f60] text-white px-3 py-1 rounded-full text-xs font-semibold"
              >
                {typeof skill === "string"
                  ? skill
                  : (skill && (skill.name || skill.label)) || "Skill"}
              </span>
            ))
          ) : (
            <span className="text-gray-400">No skills listed.</span>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="mb-6 bg-white rounded-2xl shadow px-8 py-6">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg text-[#032f60]">Links</div>
        </div>
        <ul>
          {profile.links && profile.links.length > 0 ? (
            profile.links.map((l, idx) => (
              <li key={idx} className="mb-1">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#032f60] underline break-all font-medium"
                >
                  {l.label || l.url}
                </a>
              </li>
            ))
          ) : (
            <span className="text-gray-400">No links added.</span>
          )}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="mb-6 bg-white rounded-2xl shadow px-8 py-6">
        <div className="font-bold text-lg text-[#032f60] mb-3">Recent Posts</div>
        {profile.recentPosts && profile.recentPosts.length > 0 ? (
          <div className="flex flex-col gap-5">
            {profile.recentPosts.map((post) => (
              <PostCard key={post._id} post={post} currentUserId={user._id} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No posts yet.</div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <EditProfileModalContent
          form={profile}
          setForm={setProfile}
          onSave={() => handleSave(profile)}
          loading={saving}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
    </>
  );
}