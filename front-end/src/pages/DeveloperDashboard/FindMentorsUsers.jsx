import React, { useState, useEffect } from "react";
import { Search, Loader2, Users, UserSearch, Filter } from "lucide-react";
import { searchUsers } from "../../api/users";
import MentorDeveloperCard from "../../components/MentorDeveloperCard";
import UserProfileModal from "../../components/UserProfileModal";
import Shimmer from "../../components/Shimmer";

const FindMentorsUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("mentor");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await searchUsers({ role: roleFilter, search: searchQuery });
      setUsers(data.users || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-[#032f60] text-white rounded-xl p-6 mb-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Find {roleFilter === "mentor" ? "Mentors" : "Developers"}
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            Connect with experienced professionals and grow your network
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name, username, or skills..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setRoleFilter("mentor");
                }}
                className={`px-5 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${
                  roleFilter === "mentor"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4" />
                Mentors
              </button>
              <button
                onClick={() => {
                  setRoleFilter("developer");
                }}
                className={`px-5 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${
                  roleFilter === "developer"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserSearch className="w-4 h-4" />
                Developers
              </button>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <Shimmer type="large" className="w-10 h-10 mb-4" />
            <p className="text-gray-600 font-medium">
              Loading {roleFilter}s...
            </p>
          </div>
        ) : users.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {users.length}
                </span>{" "}
                {users.length === 1 ? roleFilter : `${roleFilter}s`}
              </p>
            </div>

            {/* Grid Layout - Perfectly Aligned */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <MentorDeveloperCard
                  key={user._id}
                  user={user}
                  onUpdate={fetchUsers}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              No {roleFilter}s found
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : `No ${roleFilter}s available at the moment. Check back later.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTimeout(fetchUsers, 100);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* User Profile Modal */}
        <UserProfileModal
          userId={selectedUserId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default FindMentorsUsers;
