import React, { useState, useEffect } from "react";
import { Eye, Trash2, Flag, Search, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getReportedPosts, removePost, dismissReports } from "../../api/adminApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ContentModeration() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [stats, setStats] = useState({ pending: 0, total: 0, removedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    try {
      setLoading(true);
      const response = await getReportedPosts({ status: "pending" });
      setReportedPosts(response.data.reportedPosts || []);
      setStats(response.data.stats || { pending: 0, total: 0, removedToday: 0 });
    } catch (error) {
      console.error("Error fetching reported posts:", error);
      toast.error("Failed to load reported posts", {
        style: { background: '#dc2626', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (reportedPost) => {
    setSelectedPost(reportedPost);
    setShowPostModal(true);
  };

  const handleRemovePost = async (postId) => {
    if (!window.confirm("Are you sure you want to remove this post? This action cannot be undone.")) {
      return;
    }

    try {
      await removePost(postId, "Post removed due to community reports");
      setReportedPosts(prev => prev.filter(item => item._id !== postId));
      toast.success("Post removed successfully", {
        style: { background: '#032f60', color: '#fff' },
      });
      await fetchReportedPosts(); // Refresh the list
    } catch (error) {
      console.error("Error removing post:", error);
      toast.error("Failed to remove post", {
        style: { background: '#dc2626', color: '#fff' },
      });
    }
  };

  const handleDismissReports = async (postId) => {
    if (!window.confirm("Dismiss all reports for this post?")) {
      return;
    }

    try {
      await dismissReports(postId, "Reports reviewed and dismissed by admin");
      setReportedPosts(prev => prev.filter(item => item._id !== postId));
      toast.success("Reports dismissed successfully", {
        style: { background: '#032f60', color: '#fff' },
      });
      await fetchReportedPosts(); // Refresh the list
    } catch (error) {
      console.error("Error dismissing reports:", error);
      toast.error("Failed to dismiss reports", {
        style: { background: '#dc2626', color: '#fff' },
      });
    }
  };

  const reasonColorMap = {
    "Inappropriate Content": "bg-red-50 text-red-700 border-red-200",
    "Spam/Promotional": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Harassment": "bg-red-50 text-red-700 border-red-200",
    "Misinformation": "bg-blue-50 text-blue-700 border-blue-200",
    "Off-topic Content": "bg-gray-50 text-gray-700 border-gray-200"
  };

  const filteredPosts = reportedPosts.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const postContent = item.post?.content || '';
    const postAuthor = item.post?.userId?.name || '';
    const firstReporter = item.reports?.[0]?.reportedBy?.name || '';
    
    return postContent.toLowerCase().includes(searchLower) ||
           postAuthor.toLowerCase().includes(searchLower) ||
           firstReporter.toLowerCase().includes(searchLower);
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-8 mb-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Content Moderation</h2>
            <p className="text-blue-100">Review and moderate reported posts from users</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <Flag size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Reported Posts</p>
              <p className="text-3xl font-bold text-gray-900">{reportedPosts.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 text-red-500">
              <Flag size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
              <Eye size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Removed Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.removedToday}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-500">
              <Trash2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Reported Posts Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Reported Posts</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search reported posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reported posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reported posts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((item) => {
                  const firstReport = item.reports?.[0] || {};
                  const reporter = firstReport.reportedBy || {};
                  const post = item.post || {};
                  const author = post.userId || {};
                  const mostCommonReason = Object.keys(item.reasons || {}).sort((a, b) => 
                    (item.reasons[b] || 0) - (item.reasons[a] || 0)
                  )[0] || 'Other';
                  
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{item._id?.slice(-8) || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {reporter.profilePhoto ? (
                              <img src={reporter.profilePhoto} alt={reporter.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-800 font-medium text-xs">
                                {reporter.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{reporter.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">
                              {item.totalReports > 1 ? `+${item.totalReports - 1} more` : '1 report'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          reasonColorMap[mostCommonReason] || 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {mostCommonReason}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-2">{post.content || 'No content'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            By {author.name || 'Unknown'} • {dayjs(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewPost(item)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleDismissReports(item._id)}
                            className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 transition-colors flex items-center gap-1"
                          >
                            <RefreshCw size={14} />
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleRemovePost(item._id)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Eye size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Reported Post Details</h2>
                    <p className="text-sm text-white/90">{selectedPost.totalReports} total reports</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Post Content */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Post Content</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedPost.post?.content || 'No content'}</p>
                  {selectedPost.post?.mediaUrls?.[0] && (
                    <img 
                      src={selectedPost.post.mediaUrls[0]} 
                      alt="Post media" 
                      className="mt-4 rounded-lg max-w-full h-auto"
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    Posted by <span className="font-medium">{selectedPost.post?.userId?.name || 'Unknown'}</span> • {dayjs(selectedPost.post?.createdAt).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
              </div>

              {/* Reports List */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Reports ({selectedPost.totalReports})</h3>
                <div className="space-y-3">
                  {selectedPost.reports?.map((report, index) => (
                    <div key={report._id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {report.reportedBy?.profilePhoto ? (
                              <img src={report.reportedBy.profilePhoto} alt={report.reportedBy.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-blue-800 font-medium text-xs">
                                {report.reportedBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{report.reportedBy?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{dayjs(report.createdAt).fromNow()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          reasonColorMap[report.reason] || 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {report.reason}
                        </span>
                      </div>
                      {report.description && (
                        <p className="text-sm text-gray-700 mt-2 pl-10">{report.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDismissReports(selectedPost._id);
                  setShowPostModal(false);
                }}
                className="px-6 py-2.5 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Dismiss Reports
              </button>
              <button
                onClick={() => {
                  handleRemovePost(selectedPost._id);
                  setShowPostModal(false);
                }}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                <Trash2 size={16} />
                Remove Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
