import React, { useState, useEffect } from "react";
import { getUserProfile } from "../api/users";
import { X } from "lucide-react";
import PostCard from "../pages/DeveloperDashboard/components/postcard/PostCard"; // Update the path accordingly

const HEADER_COLOR = "#032f60"; // Deep Blue

export default function UserProfileModal({ userId, initialData, isOpen, onClose }) {
  const [profile, setProfile] = useState(initialData || null);

  useEffect(() => {
    if (!userId || !isOpen) return;
    getUserProfile(userId).then((data) => setProfile(data));
  }, [userId, isOpen]);

  if (!isOpen || !profile) return null;  // Do not render modal if no profile

  function daysAgo(dateStr) {
    if (!dateStr) return "";
    const created = new Date(dateStr);
    const now = new Date();
    const diffTime = now - created;
    if (isNaN(diffTime)) return "";
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  };

  const modalStyle = {
    background: "#ffffff",
    borderRadius: "1.5rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    width: "90%",
    maxWidth: "960px",
    maxHeight: "90vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={modalStyle}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-lg border border-gray-200 z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div
          className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 pb-6 border-b border-gray-200"
          style={{
            backgroundColor: "#f7f9fb",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        >
          <div
            className="flex-shrink-0 w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl"
            style={{ borderColor: HEADER_COLOR }}
          >
            <img
              src={
                profile.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=032f60&color=fff&size=128`
              }
              alt={profile.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-grow">
            <h2
              className="text-4xl font-extrabold mb-1"
              style={{ color: HEADER_COLOR }}
            >
              {profile.name}
            </h2>
            <div className="text-blue-600 text-base mb-4 font-medium">
              @{profile.username || profile.email}
            </div>

            <div className="flex gap-10 text-center text-gray-700">
              <div className="flex flex-col items-center">
                <div
                  className="text-3xl font-extrabold"
                  style={{ color: HEADER_COLOR }}
                >
                  {profile.followersCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Followers</div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="text-3xl font-extrabold"
                  style={{ color: HEADER_COLOR }}
                >
                  {profile.followingCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Following</div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="text-3xl font-extrabold"
                  style={{ color: HEADER_COLOR }}
                >
                  {profile.postsCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Posts</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 italic">
              {profile.createdAt
                ? daysAgo(profile.createdAt) === 0
                  ? "Joined today 🎉"
                  : `Joined ${daysAgo(profile.createdAt)} days ago`
                : ""}
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-3" style={{ color: HEADER_COLOR }}>
              About
            </h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              {profile.bio || "No bio provided."}
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-3" style={{ color: HEADER_COLOR }}>
              Skills & Technologies
            </h3>
            {profile.skills?.length ? (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: HEADER_COLOR }}
                    className="text-white px-4 py-1.5 rounded-full text-sm font-medium transition hover:opacity-90 shadow-md"
                  >
                    {typeof skill === "string" ? skill : skill.name || "Skill"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills listed.</p>
            )}
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold mb-3" style={{ color: HEADER_COLOR }}>
              Links
            </h3>
            {profile.links?.length ? (
              <ul className="space-y-2">
                {profile.links.map((link, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="text-blue-500 mr-2">🔗</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-words transition font-medium"
                    >
                      {link.label || link.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No links added.</p>
            )}
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4" style={{ color: HEADER_COLOR }}>
              Recent Posts
            </h3>
            {Array.isArray(profile.recentPosts) && profile.recentPosts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {profile.recentPosts.slice(0, 3).map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={profile._id}
                    hideComments
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent posts.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
