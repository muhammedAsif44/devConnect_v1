import React, { useState } from "react";
import {
  Eye,
  UserPlus,
  Check,
  Star,
  MessageCircle,
  Video,
  UserCheck,
  Clock,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { followUser, unfollowUser } from "../api/followApi";
import { sendFriendRequest } from "../api/friendRequestApi";
import Modal from "../pages/DeveloperDashboard/components/Modal";
import UserProfileModal from "./UserProfileModal";
import PremiumBadge from "./shared/PremiumBadge";
import MentorBadge from "./shared/MentorBadge";  

const MentorDeveloperCard = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [connectionStatus, setConnectionStatus] = useState(user.connectionStatus || "none");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);

  // Modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalUserData, setModalUserData] = useState(null);

  const canChatVideo = connectionStatus === "accepted";

  const handleFollowToggle = async () => {
    if (isFollowing) {
      const res = await unfollowUser(user._id);
      setIsFollowing(false);
      setFollowersCount(res.followersCount);
    } else {
      const res = await followUser(user._id);
      setIsFollowing(true);
      setFollowersCount(res.followersCount);
    }
    onUpdate && onUpdate();
  };

  const handleSendRequest = async () => {
    await sendFriendRequest(user._id, requestMessage);
    setConnectionStatus("pending");
    setShowRequestModal(false);
    onUpdate && onUpdate();
  };

  const skillColors = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-green-50 text-green-700 border-green-200",
    "bg-orange-50 text-orange-700 border-orange-200",
  ];

  const allSkills = [...(user.skills || []), ...(user.expertise || [])];
  const getSkillName = (s) => typeof s === "string" ? s : s?.name || s?.skill || "Skill";

  // Open modal and pass user data
  const handleViewProfile = (id) => {
    setProfileModalOpen(true);
    setModalUserId(id);
    setModalUserData(user);  
  };

  return (
    <>
      {/* Compact CARD */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all duration-200 overflow-hidden group h-full flex flex-col">
        <div className="p-4">
          {/* Profile Section - Compact */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <img
                src={
                  user.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=032f60&color=fff&size=128`
                }
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover ring-1 ring-gray-200 group-hover:ring-blue-400 transition-all"
              />
              {user.role === "mentor" && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#032f60] rounded-full p-1 ring-1 ring-white">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-1.5 flex-wrap mb-1">
                <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {user.name}
                </h3>
                {user.rating?.average > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {user.rating.average.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <PremiumBadge user={user} variant="small" />
                <MentorBadge user={user} variant="small" />
              </div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                {user.role === "mentor" ? "Mentor" : "Developer"}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="font-medium">{followersCount} followers</span>
                <span>•</span>
                <span className="font-medium">{user.followingCount || 0} following</span>
              </div>
            </div>
          </div>

          {/* Bio - Compact */}
          {user.bio && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-snug">
              {user.bio}
            </p>
          )}

          {/* Skills - Compact */}
          {allSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {allSkills.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${skillColors[i % skillColors.length]}`}
                >
                  {getSkillName(skill)}
                </span>
              ))}
              {allSkills.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                  +{allSkills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons - Compact & Aligned */}
          <div className="space-y-2 mt-auto">
            {/* Row 1: View Profile & Follow */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleViewProfile(user._id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#032f60] text-white rounded-lg font-semibold text-xs hover:bg-[#021d38] active:scale-95 transition-all shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View</span>
              </button>
              <button
                onClick={handleFollowToggle}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 shadow-sm ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-50 text-[#032f60] border border-[#032f60]/20 hover:bg-blue-100"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Followed</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Row 2: Connect Button */}
            <button
              onClick={() => connectionStatus === "none" && setShowRequestModal(true)}
              disabled={connectionStatus !== "none"}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
                connectionStatus === "pending"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : connectionStatus === "accepted"
                  ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  : "bg-white text-[#032f60] border border-[#032f60] hover:bg-[#032f60] hover:text-white active:scale-95"
              }`}
            >
              {connectionStatus === "pending" ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Request Sent</span>
                </>
              ) : connectionStatus === "accepted" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="truncate">Connect</span>
                </>
              )}
            </button>

            {/* Row 3: Chat & Video (only if connected) */}
            {canChatVideo && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => navigate(`/video-call/${user._id}`)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold text-xs hover:bg-green-700 active:scale-95 transition-all shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <UserProfileModal
          userId={modalUserId}
          initialData={modalUserData}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Connect with {user.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Introduce yourself and explain why you'd like to connect
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Hi! I'd love to connect and learn from your experience..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-[#032f60] focus:border-transparent text-sm"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mb-4 mt-2">
              {requestMessage.length}/500 characters
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 px-4 py-3 bg-[#032f60] text-white rounded-xl font-semibold hover:bg-[#021d38] transition-all shadow-md"
              >
                Send Request
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MentorDeveloperCard;
