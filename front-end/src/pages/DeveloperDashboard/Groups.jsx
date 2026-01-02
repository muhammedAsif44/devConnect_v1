import React, { useState, useEffect } from "react";
import { Plus, Search, MessageCircle, Users, Settings } from "lucide-react";
import toast from "react-hot-toast";

export default function Groups() {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "React Developers",
      members: 1247,
      posts: 89,
      description: "A community for React developers to share knowledge, ask questions, and discuss best practices.",
      tags: ["React", "JavaScript", "Frontend"],
      color: "bg-cyan-100",
      icon: "RD",
      newPosts: 5,
    },
    {
      id: 2,
      name: "Machine Learning Hub",
      members: 892,
      posts: 156,
      description: "Connect with ML engineers and data scientists. Share projects, discuss algorithms, and stay updated with the latest in AI.",
      tags: ["Python", "TensorFlow", "AI"],
      color: "bg-yellow-100",
      icon: "ML",
      newPosts: 12,
    },
    {
      id: 3,
      name: "UI/UX Designers & Developers",
      members: 956,
      posts: 234,
      description: "Bridging the gap between design and development. Share resources, get feedback, and collaborate.",
      tags: ["Design", "React", "Figma"],
      color: "bg-pink-100",
      icon: "UX",
      newPosts: 8,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [myGroups, setMyGroups] = useState([1]); // Mock data - user is member of group 1

  useEffect(() => {
    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const handleJoinGroup = (groupId) => {
    if (myGroups.includes(groupId)) {
      setMyGroups(myGroups.filter(id => id !== groupId));
      toast.success("Left group");
    } else {
      setMyGroups([...myGroups, groupId]);
      toast.success("Joined group!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Groups & Communities
          </h1>
          <p className="text-gray-600">
            Join communities, share knowledge, and connect with like-minded developers
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#032f60] text-white px-6 py-3 rounded-lg hover:bg-[#024a8f] transition shadow-lg font-semibold">
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#032f60] focus:border-transparent transition"
        />
      </div>

      {/* My Groups Section */}
      {myGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-[#032f60]" />
            My Groups ({myGroups.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.filter(g => myGroups.includes(g.id)).map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember={true}
                onJoin={() => handleJoinGroup(group.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Groups / Discover Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-[#032f60]">
            Discover Communities
          </span>
          <span className="text-gray-500 text-sm">({filteredGroups.length})</span>
        </h2>
        
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember={myGroups.includes(group.id)}
                onJoin={() => handleJoinGroup(group.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No groups found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

// GroupCard Component
function GroupCard({ group, isMember, onJoin }) {
  const tagColors = {
    "React": "bg-cyan-200 text-cyan-800",
    "JavaScript": "bg-yellow-200 text-yellow-800",
    "Frontend": "bg-blue-200 text-blue-800",
    "Python": "bg-yellow-200 text-yellow-800",
    "TensorFlow": "bg-orange-200 text-orange-800",
    "AI": "bg-purple-200 text-purple-800",
    "Design": "bg-pink-200 text-pink-800",
    "Figma": "bg-orange-200 text-orange-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden flex flex-col">
      {/* Header with Color */}
      <div className={`${group.color} h-20 flex items-center justify-center`}>
        <span className="text-2xl font-bold text-gray-700">{group.icon}</span>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{group.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Users size={16} />
            {group.members} members
          </span>
          <span>•</span>
          <span>{group.posts} posts</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                tagColors[tag] || "bg-gray-200 text-gray-800"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* New Posts Badge */}
        {group.newPosts > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            {group.newPosts} new posts today
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition">
            <MessageCircle size={16} />
            Chat
          </button>
          <button
            onClick={onJoin}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              isMember
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-[#032f60] text-white hover:bg-[#024a8f]"
            }`}
          >
            {isMember ? "Leave" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
