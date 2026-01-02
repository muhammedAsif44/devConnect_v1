import React from "react";
import { Check } from "lucide-react";
import PremiumBadge from "../../../components/shared/PremiumBadge";
import MentorBadge from "../../../components/shared/MentorBadge";

const ProfileHeader = ({
  user,
  onEditProfile, // pass function to enable editing, otherwise hides button
  showStats = true,
}) => (
  <div className="relative bg-gradient-to-tr from-[#032f60] to-[#17417e] rounded-t-2xl min-h-[180px] w-full shadow-md pb-10">
    {/* Profile Photo & Info */}
    <div className="absolute left-7 top-24 flex items-center gap-5 z-10">
      <img
        src={user.profilePhoto}
        alt={user.name}
        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
      />
      <div className="pt-7">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-[#182846]">{user.name}</span>
          <PremiumBadge user={user} variant="default" />
          <MentorBadge user={user} variant="default" />
        </div>
        <div className="text-gray-600 text-base">@{user.username}</div>
        <div className="text-sm text-gray-500 flex items-center gap-3 mt-1 flex-wrap">
          {user.location && <span>{user.location}</span>}
          {user.createdAt && (
            <>
              <span>·</span>
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Edit Profile Button */}
    {onEditProfile && (
      <div className="absolute right-8 top-8 z-10">
        <button
          onClick={onEditProfile}
          className="px-5 py-2 border rounded-lg font-medium bg-white hover:bg-gray-100 shadow-sm transition active:scale-95"
        >
          Edit Profile
        </button>
      </div>
    )}

    {/* Stats - responsive and always visible */}
    {showStats && (
      <div className="flex justify-center items-center gap-12 md:gap-20 mt-40 pb-7">
        <div className="flex flex-col items-center min-w-[68px]">
          <span className="font-bold text-lg text-gray-900">
            {user.followersCount ??
              (typeof user.followers === "number"
                ? user.followers
                : Array.isArray(user.followers)
                ? user.followers.length
                : 0)}
          </span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="flex flex-col items-center min-w-[68px]">
          <span className="font-bold text-lg text-gray-900">
            {user.followingCount ??
              (typeof user.following === "number"
                ? user.following
                : Array.isArray(user.following)
                ? user.following.length
                : 0)}
          </span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
        <div className="flex flex-col items-center min-w-[68px]">
          <span className="font-bold text-lg text-gray-900">
            {user.postsCount ??
              (user.posts
                ? Array.isArray(user.posts)
                  ? user.posts.length
                  : typeof user.posts === "number"
                  ? user.posts
                  : 0
                : 0)}
          </span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
      </div>
    )}
  </div>
);

export default ProfileHeader;
