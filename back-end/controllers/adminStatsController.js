const User = require("../model/userSchema");
const Report = require("../model/reportSchema");
const Transaction = require("../model/transactionSchema");

// GET dashboard stats (summary cards, trends, etc.)
exports.getDashboardStats = async (req, res) => {
  try {
    const Session = require("../model/sessionSchema");

    const totalUsers = await User.countDocuments({ role: { $in: ["developer", "mentor"] } });
    const totalMentors = await User.countDocuments({ role: "mentor" });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeUsersToday = await User.countDocuments({ updatedAt: { $gte: startOfToday } });

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const sessionsThisWeek = await Session.countDocuments({ createdAt: { $gte: startOfWeek } });

    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const sessionsLastWeek = await Session.countDocuments({ createdAt: { $gte: lastWeekStart, $lt: startOfWeek } });
    const sessionsChange = sessionsLastWeek > 0 ? (((sessionsThisWeek - sessionsLastWeek) / sessionsLastWeek) * 100).toFixed(1) : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthRevenue = await Transaction.aggregate([
      { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueThisMonth = thisMonthRevenue[0]?.total || 0;

    const lastMonthStart = new Date(startOfMonth);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthRevenue = await Transaction.aggregate([
      { $match: { status: "completed", createdAt: { $gte: lastMonthStart, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueLastMonth = lastMonthRevenue[0]?.total || 0;
    const revenueChange = revenueLastMonth > 0 ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1) : 0;

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const reviewedThisWeek = await Report.countDocuments({ reviewedAt: { $gte: startOfWeek } });

    const lastWeekReviewed = await Report.countDocuments({ reviewedAt: { $gte: lastWeekStart, $lt: startOfWeek } });
    const contentChange = lastWeekReviewed > 0 ? (((reviewedThisWeek - lastWeekReviewed) / lastWeekReviewed) * 100).toFixed(1) : 0;

    // Build revenueTrend (6 months)
    const revenueTrendData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthRevenue = await Transaction.aggregate([
        { $match: { status: "completed", createdAt: { $gte: monthStart, $lt: monthEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      revenueTrendData.push({ month: monthStart.toLocaleString('default', { month: 'short' }), revenue: monthRevenue[0]?.total || 0 });
    }

    // User growth (6 months)
    const userGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const users = await User.countDocuments({ role: "developer", createdAt: { $lt: monthEnd } });
      const mentors = await User.countDocuments({ role: "mentor", createdAt: { $lt: monthEnd } });

      userGrowthData.push({ month: monthStart.toLocaleString('default', { month: 'short' }), users, mentors });
    }

    // Session activity last 7 days
    const sessionActivityData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const completed = await Session.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd }, status: "completed" });
      const pending = await Session.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd }, status: { $ne: "completed" } });

      sessionActivityData.push({ day: days[dayStart.getDay()], completed, pending });
    }

    res.json({
      stats: [
        { title: "Active Users Today", value: activeUsersToday, icon: "users", change: "+12.5%", vs: "vs last week" },
        { title: "Sessions This Week", value: sessionsThisWeek, icon: "calendar", change: sessionsChange >= 0 ? `+${sessionsChange}%` : `${sessionsChange}%`, vs: "vs last week" },
        { title: "Revenue This Month", value: `₹${revenueThisMonth.toLocaleString()}`, icon: "dollar", change: revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`, vs: "vs last month" },
        { title: "Content Moderated", value: reviewedThisWeek, icon: "shield", change: contentChange >= 0 ? `+${contentChange}%` : `${contentChange}%`, vs: "vs last week" },
      ],
      revenueTrend: revenueTrendData,
      userGrowth: userGrowthData,
      sessionActivity: sessionActivityData,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const Session = require("../model/sessionSchema");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const totalRevenueData = await Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    const thisMonthRevenueData = await Transaction.aggregate([{ $match: { status: "completed", createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const thisMonthRevenue = thisMonthRevenueData[0]?.total || 0;

    const lastMonthRevenueData = await Transaction.aggregate([{ $match: { status: "completed", createdAt: { $gte: lastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const lastMonthRevenue = lastMonthRevenueData[0]?.total || 0;

    const revenueChange = lastMonthRevenue > 0 ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : 0;

    const activeSessions = await Session.countDocuments({ createdAt: { $gte: startOfMonth }, status: { $ne: "cancelled" } });

    const lastMonthSessions = await Session.countDocuments({ createdAt: { $gte: lastMonth, $lte: endOfLastMonth }, status: { $ne: "cancelled" } });

    const sessionsChange = lastMonthSessions > 0 ? (((activeSessions - lastMonthSessions) / lastMonthSessions) * 100).toFixed(1) : 0;

    const activeThisMonth = await User.countDocuments({ updatedAt: { $gte: startOfMonth } });
    const activeLastMonth = await User.countDocuments({ updatedAt: { $gte: lastMonth, $lte: endOfLastMonth } });

    const totalUsers = await User.countDocuments({ role: { $in: ["developer", "mentor"] } });

    const retentionRate = totalUsers > 0 ? ((activeThisMonth / totalUsers) * 100).toFixed(1) : 0;
    const lastRetentionRate = totalUsers > 0 ? ((activeLastMonth / totalUsers) * 100).toFixed(1) : 0;

    const retentionChange = lastRetentionRate > 0 ? (retentionRate - lastRetentionRate).toFixed(1) : 0;

    // Revenue trend and user growth logic can be reused by frontend when needed
    res.json({
      totalRevenue: { value: totalRevenue, change: revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%` },
      activeSessions: { value: activeSessions, change: sessionsChange >= 0 ? `+${sessionsChange}%` : `${sessionsChange}%` },
      userRetention: { value: parseFloat(retentionRate), change: retentionChange >= 0 ? `+${retentionChange}%` : `${retentionChange}%` },
      revenueTrend: [],
      userGrowth: [],
    });
  } catch (err) {
    console.error("Get analytics error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
