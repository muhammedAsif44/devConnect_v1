import React, { useState, useEffect } from "react";
import { DollarSign, CreditCard, TrendingUp, Search, Filter, Download } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Payments() {
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    percentageChange: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  });

  useEffect(() => {
    fetchRevenueStats();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pagination.currentPage]);

  const fetchRevenueStats = async () => {
    try {
      const response = await api.get("/admin/revenue-stats");
      setRevenueStats(response.data);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      toast.error("Failed to load revenue statistics", {
        style: { background: '#dc2626', color: '#fff' },
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await api.get("/admin/transactions", { params });
      setTransactions(response.data.transactions || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions", {
        style: { background: '#dc2626', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const userName = transaction.userId?.name || "";
    const userEmail = transaction.userId?.email || "";
    const transactionId = transaction.transactionId || "";
    
    return userName.toLowerCase().includes(searchLower) ||
           userEmail.toLowerCase().includes(searchLower) ||
           transactionId.toLowerCase().includes(searchLower);
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-8 mb-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Payments & Revenue</h2>
            <p className="text-blue-100">Track transactions and financial performance</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <CreditCard size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{revenueStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">All-time earnings from premium subscriptions</p>
        </div>

        {/* This Month Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium mb-2">This Month Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{revenueStats.thisMonthRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1 font-semibold ${
              revenueStats.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {revenueStats.percentageChange >= 0 ? '+' : ''}{revenueStats.percentageChange}%
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500 mt-1">Latest payment activities and transaction history</p>
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => toast.success("Export feature coming soon!")}
            >
              <Download size={16} />
              Export
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by transaction ID, user, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-4">
              <CreditCard className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "No transactions match your search criteria"
                : "Transactions will appear here when users purchase premium plans"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          {transaction.transactionId?.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {transaction.userId?.profilePhoto ? (
                              <img
                                src={transaction.userId.profilePhoto}
                                alt={transaction.userId.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-blue-800 font-medium text-xs">
                                {transaction.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {transaction.userId?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.userId?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.planId?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.planId?.durationInDays} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{transaction.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          getStatusBadge(transaction.status)
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(transaction.createdAt).format('MMM D, YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Razorpay
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages} 
                  ({pagination.total} total transactions)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
