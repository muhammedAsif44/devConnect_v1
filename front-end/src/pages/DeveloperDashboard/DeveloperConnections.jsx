import FriendRequestList from "../../components/FriendRequests/FriendRequestList";
import FriendList from "../../components/FriendRequests/FriendList";

export default function ConnectionsPage() {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-[#032f60] text-white rounded-xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            My Connections
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            Manage your network and connection requests
          </p>
        </div>

        {/* Connected Developers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Connected Developers
            </h3>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Your network
            </span>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <FriendList />
          </div>
        </div>

        {/* Requests Section - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Received Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Received Requests
              </h3>
            </div>
            <FriendRequestList type="received" />
          </div>

          {/* Sent Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Sent Requests
              </h3>
            </div>
            <FriendRequestList type="sent" />
          </div>
        </div>
      </div>
    </div>
  );
}
