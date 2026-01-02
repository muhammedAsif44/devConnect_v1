// const User = require("../model/userSchema");
// const Report = require("../model/reportSchema");
// const Post = require("../model/postSchema");
// const Transaction = require("../model/transactionSchema");
// const { sendEmail, sendAdminNotification } = require("../services/emailService");

// // --- GET all users/mentors
// exports.getUsers = async (req, res) => {
//   try {
//     // Parse query params safely
//     let { page = 1, limit = 15, search, role } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const filter = {};

//     // Search filter
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { role: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Role filter
//     if (role && role !== "all") filter.role = role;

//     const skip = (page - 1) * limit;

//     const users = await User.find(filter)
//       .select("-password")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const total = await User.countDocuments(filter);

//     res.json({
//       users,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     });
//   } catch (err) {
//     console.error("Get Users Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- GET single user
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Get User By ID Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- CREATE new user
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "Email already exists" });

//     const user = await User.create({ name, email, password, role });

//     // If role is mentor, notify admin for approval
//     if (role === "mentor") await sendAdminNotification(user);

//     res.status(201).json(user);
//   } catch (err) {
//     console.error("Create User Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- UPDATE user
// exports.updateUser = async (req, res) => {
//   try {
//     const { name, email, role, isActive } = req.body;
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.role = role || user.role;
//     if (isActive !== undefined) user.isActive = isActive;

//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.error("Update User Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- DELETE user
// exports.deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await User.findByIdAndDelete(userId);

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Delete User Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- GET dashboard stats
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const Session = require("../model/sessionSchema");
//     const Post = require("../model/postSchema");
//     const Report = require("../model/reportSchema");
    
//     const totalUsers = await User.countDocuments({ role: { $in: ["developer", "mentor"] } });
//     const totalMentors = await User.countDocuments({ role: "mentor" });

//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

//     const activeUsersToday = await User.countDocuments({ updatedAt: { $gte: startOfToday } });
    
//     // ===== Sessions This Week =====
//     const startOfWeek = new Date();
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
//     startOfWeek.setHours(0, 0, 0, 0);
    
//     const sessionsThisWeek = await Session.countDocuments({
//       createdAt: { $gte: startOfWeek }
//     });
    
//     // Calculate percentage change vs last week
//     const lastWeekStart = new Date(startOfWeek);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);
//     const sessionsLastWeek = await Session.countDocuments({
//       createdAt: { $gte: lastWeekStart, $lt: startOfWeek }
//     });
//     const sessionsChange = sessionsLastWeek > 0 
//       ? (((sessionsThisWeek - sessionsLastWeek) / sessionsLastWeek) * 100).toFixed(1)
//       : 0;
    
//     // ===== Revenue This Month (from Transaction schema) =====
//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);
    
//     // Get actual revenue from completed transactions
//     const thisMonthRevenue = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: startOfMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const revenueThisMonth = thisMonthRevenue[0]?.total || 0;
    
//     // Last month revenue for comparison
//     const lastMonthStart = new Date(startOfMonth);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
//     const lastMonthRevenue = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: lastMonthStart, $lt: startOfMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const revenueLastMonth = lastMonthRevenue[0]?.total || 0;
//     const revenueChange = revenueLastMonth > 0
//       ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
//       : 0;
    
//     // ===== Content Moderation stats =====
//     const totalReports = await Report.countDocuments();
//     const pendingReports = await Report.countDocuments({ status: "pending" });
//     const reviewedThisWeek = await Report.countDocuments({
//       reviewedAt: { $gte: startOfWeek }
//     });
    
//     const lastWeekReviewed = await Report.countDocuments({
//       reviewedAt: { $gte: lastWeekStart, $lt: startOfWeek }
//     });
//     const contentChange = lastWeekReviewed > 0
//       ? (((reviewedThisWeek - lastWeekReviewed) / lastWeekReviewed) * 100).toFixed(1)
//       : 0;

//     // ===== Revenue Trend (last 6 months) =====
//     const revenueTrendData = [];
//     for (let i = 5; i >= 0; i--) {
//       const monthStart = new Date();
//       monthStart.setMonth(monthStart.getMonth() - i);
//       monthStart.setDate(1);
//       monthStart.setHours(0, 0, 0, 0);
      
//       const monthEnd = new Date(monthStart);
//       monthEnd.setMonth(monthEnd.getMonth() + 1);
      
//       const monthRevenue = await Transaction.aggregate([
//         { 
//           $match: { 
//             status: "completed",
//             createdAt: { $gte: monthStart, $lt: monthEnd }
//           } 
//         },
//         { $group: { _id: null, total: { $sum: "$amount" } } }
//       ]);
      
//       revenueTrendData.push({
//         month: monthStart.toLocaleString('default', { month: 'short' }),
//         revenue: monthRevenue[0]?.total || 0
//       });
//     }

//     // ===== User Growth (last 6 months) =====
//     const userGrowthData = [];
//     for (let i = 5; i >= 0; i--) {
//       const monthStart = new Date();
//       monthStart.setMonth(monthStart.getMonth() - i);
//       monthStart.setDate(1);
//       monthStart.setHours(0, 0, 0, 0);
      
//       const monthEnd = new Date(monthStart);
//       monthEnd.setMonth(monthEnd.getMonth() + 1);
      
//       const users = await User.countDocuments({
//         role: "developer",
//         createdAt: { $lt: monthEnd }
//       });
      
//       const mentors = await User.countDocuments({
//         role: "mentor",
//         createdAt: { $lt: monthEnd }
//       });
      
//       userGrowthData.push({
//         month: monthStart.toLocaleString('default', { month: 'short' }),
//         users,
//         mentors
//       });
//     }

//     // ===== Session Activity (last 7 days) =====
//     const sessionActivityData = [];
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
//     for (let i = 6; i >= 0; i--) {
//       const dayStart = new Date();
//       dayStart.setDate(dayStart.getDate() - i);
//       dayStart.setHours(0, 0, 0, 0);
      
//       const dayEnd = new Date(dayStart);
//       dayEnd.setHours(23, 59, 59, 999);
      
//       const completed = await Session.countDocuments({
//         createdAt: { $gte: dayStart, $lte: dayEnd },
//         status: "completed"
//       });
      
//       const pending = await Session.countDocuments({
//         createdAt: { $gte: dayStart, $lte: dayEnd },
//         status: { $ne: "completed" }
//       });
      
//       sessionActivityData.push({
//         day: days[dayStart.getDay()],
//         completed,
//         pending
//       });
//     }

//     res.json({
//       stats: [
//         { 
//           title: "Active Users Today", 
//           value: activeUsersToday, 
//           icon: "users",
//           change: "+12.5%",
//           vs: "vs last week"
//         },
//         { 
//           title: "Sessions This Week", 
//           value: sessionsThisWeek, 
//           icon: "calendar",
//           change: sessionsChange >= 0 ? `+${sessionsChange}%` : `${sessionsChange}%`,
//           vs: "vs last week"
//         },
//         { 
//           title: "Revenue This Month", 
//           value: `₹${revenueThisMonth.toLocaleString()}`, 
//           icon: "dollar",
//           change: revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`,
//           vs: "vs last month"
//         },
//         { 
//           title: "Content Moderated", 
//           value: reviewedThisWeek, 
//           icon: "shield",
//           change: contentChange >= 0 ? `+${contentChange}%` : `${contentChange}%`,
//           vs: "vs last week"
//         },
//       ],
//       revenueTrend: revenueTrendData,
//       userGrowth: userGrowthData,
//       sessionActivity: sessionActivityData,
//     });
//   } catch (err) {
//     console.error("Dashboard Stats Error:", err);
//     res.status(500).json({ message: "Server error fetching dashboard stats" });
//   }
// };

//  // ===== Approve Mentor =====
// exports.approveMentor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const mentor = await User.findById(id);

//     if (!mentor || mentor.role !== "mentor") {
//       return res.status(404).json({ message: "Mentor not found" });
//     }

//     if (!mentor.mentorProfile) mentor.mentorProfile = {};
//     mentor.mentorProfile.approvedByAdmin = true;
//     mentor.mentorProfile.status = "approved"; // optional
//     mentor.status = "approved"; // <-- CRUCIAL for frontend
//     await mentor.save();

//     await sendEmail({
//       to: mentor.email,
//       subject: "Mentor Account Approved",
//       html: `<h3>Hi ${mentor.name},</h3>
//              <p>Your mentor profile has been approved by admin. You can now log in and start mentoring.</p>`,
//     });

//     res.status(200).json({ message: "Mentor approved successfully", mentor });
//   } catch (err) {
//     console.error("Approve Mentor Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.rejectMentor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const mentor = await User.findById(id);

//     if (!mentor || mentor.role !== "mentor") {
//       return res.status(404).json({ message: "Mentor not found" });
//     }

//     if (!mentor.mentorProfile) mentor.mentorProfile = {};
//     mentor.mentorProfile.approvedByAdmin = false;
//     mentor.mentorProfile.status = "rejected"; // optional
//     mentor.status = "rejected"; // <-- CRUCIAL for frontend
//     await mentor.save();

//     await sendEmail({
//       to: mentor.email,
//       subject: "Mentor Account Rejected",
//       html: `<h3>Hi ${mentor.name},</h3>
//              <p>Unfortunately, your mentor application was not approved at this time. 
//              You may contact support for clarification.</p>`,
//     });

//     res.status(200).json({ message: "Mentor rejected successfully" });
//   } catch (err) {
//     console.error("Reject Mentor Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===== Fetch Pending Mentors =====
// exports.getPendingMentors = async (req, res) => {
//   try {
//     const mentors = await User.find({
//       role: "mentor",
//       $or: [
//         { "mentorProfile.approvedByAdmin": false },
//         { mentorProfile: { $exists: false } },
//       ],
//     }).select("-password");

//     res.status(200).json(mentors);
//   } catch (err) {
//     console.error("Pending mentors fetch error:", err);
//     res.status(500).json({ message: "Server error fetching pending mentors" });
//   }
// };

// // ===== CONTENT MODERATION =====

// // Get all reported posts
// exports.getReportedPosts = async (req, res) => {
//   try {
//     const { status = "pending", page = 1, limit = 20 } = req.query;
    
//     const filter = { entityType: "Post" };
//     if (status !== "all") {
//       filter.status = status;
//     }

//     const skip = (page - 1) * limit;

//     const reports = await Report.find(filter)
//       .populate({
//         path: "entityId",
//         model: "Post",
//         populate: {
//           path: "userId",
//           select: "name email profilePhoto"
//         }
//       })
//       .populate("reportedBy", "name email profilePhoto")
//       .populate("reviewedBy", "name")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     // Group reports by post
//     const reportsByPost = {};
//     reports.forEach(report => {
//       if (!report.entityId) return; // Skip if post was deleted
      
//       const postId = report.entityId._id.toString();
//       if (!reportsByPost[postId]) {
//         reportsByPost[postId] = {
//           _id: postId,
//           post: report.entityId,
//           reports: [],
//           totalReports: 0,
//           reasons: {}
//         };
//       }
      
//       reportsByPost[postId].reports.push({
//         _id: report._id,
//         reportedBy: report.reportedBy,
//         reason: report.reason,
//         description: report.description,
//         status: report.status,
//         createdAt: report.createdAt
//       });
      
//       reportsByPost[postId].totalReports++;
//       reportsByPost[postId].reasons[report.reason] = 
//         (reportsByPost[postId].reasons[report.reason] || 0) + 1;
//     });

//     const reportedPosts = Object.values(reportsByPost);
//     const total = await Report.countDocuments(filter);

//     // Get stats
//     const pendingCount = await Report.countDocuments({ 
//       entityType: "Post", 
//       status: "pending" 
//     });
    
//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);
//     const removedToday = await Report.countDocuments({
//       entityType: "Post",
//       status: "removed",
//       reviewedAt: { $gte: startOfToday }
//     });

//     res.json({
//       reportedPosts,
//       stats: {
//         pending: pendingCount,
//         total: await Report.countDocuments({ entityType: "Post" }),
//         removedToday
//       },
//       pagination: {
//         currentPage: Number(page),
//         totalPages: Math.ceil(total / limit),
//         total
//       }
//     });
//   } catch (err) {
//     console.error("Get reported posts error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Review/Dismiss a report
// exports.reviewReport = async (req, res) => {
//   try {
//     const { reportId } = req.params;
//     const { action, adminNotes } = req.body; // action: "dismiss" or "remove"

//     if (!action || !["dismiss", "remove"].includes(action)) {
//       return res.status(400).json({ message: "Invalid action. Use 'dismiss' or 'remove'" });
//     }

//     const report = await Report.findById(reportId).populate("entityId");
//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     // Update report status
//     report.status = action === "dismiss" ? "dismissed" : "removed";
//     report.reviewedBy = req.user._id;
//     report.reviewedAt = new Date();
//     if (adminNotes) report.adminNotes = adminNotes;
//     await report.save();

//     // If removing, also mark the post as removed
//     if (action === "remove" && report.entityId) {
//       const post = await Post.findById(report.entityId._id);
//       if (post) {
//         post.isRemoved = true;
//         post.moderatedAt = new Date();
//         await post.save();
//       }
//     }

//     res.json({ 
//       message: `Report ${action === "dismiss" ? "dismissed" : "removed"} successfully`,
//       report 
//     });
//   } catch (err) {
//     console.error("Review report error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Remove post (admin action)
// exports.removeReportedPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { adminNotes } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Mark post as removed
//     post.isRemoved = true;
//     post.moderatedAt = new Date();
//     await post.save();

//     // Update all reports for this post
//     await Report.updateMany(
//       { entityType: "Post", entityId: postId, status: "pending" },
//       { 
//         status: "removed",
//         reviewedBy: req.user._id,
//         reviewedAt: new Date(),
//         adminNotes: adminNotes || "Post removed by admin"
//       }
//     );

//     res.json({ message: "Post removed successfully" });
//   } catch (err) {
//     console.error("Remove post error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Dismiss all reports for a post
// exports.dismissReports = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { adminNotes } = req.body;

//     const result = await Report.updateMany(
//       { entityType: "Post", entityId: postId, status: "pending" },
//       { 
//         status: "dismissed",
//         reviewedBy: req.user._id,
//         reviewedAt: new Date(),
//         adminNotes: adminNotes || "Reports dismissed by admin"
//       }
//     );

//     res.json({ 
//       message: "Reports dismissed successfully",
//       modifiedCount: result.modifiedCount 
//     });
//   } catch (err) {
//     console.error("Dismiss reports error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ===== PAYMENTS & REVENUE =====

// // Get revenue statistics
// exports.getRevenueStats = async (req, res) => {
//   try {
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

//     // Total Revenue (all completed transactions)
//     const totalRevenue = await Transaction.aggregate([
//       { $match: { status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     // This Month Revenue
//     const thisMonthRevenue = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: startOfMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     // Last Month Revenue
//     const lastMonthRevenue = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     const total = totalRevenue[0]?.total || 0;
//     const thisMonth = thisMonthRevenue[0]?.total || 0;
//     const lastMonthTotal = lastMonthRevenue[0]?.total || 0;

//     // Calculate percentage change
//     const percentageChange = lastMonthTotal > 0
//       ? (((thisMonth - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
//       : 0;

//     res.json({
//       totalRevenue: total,
//       thisMonthRevenue: thisMonth,
//       lastMonthRevenue: lastMonthTotal,
//       percentageChange: Number(percentageChange),
//     });
//   } catch (err) {
//     console.error("Get revenue stats error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get recent transactions
// exports.getTransactions = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, search } = req.query;
    
//     const filter = {};
//     if (status && status !== "all") {
//       filter.status = status;
//     }

//     const skip = (page - 1) * limit;

//     const transactions = await Transaction.find(filter)
//       .populate({
//         path: "userId",
//         select: "name email profilePhoto"
//       })
//       .populate({
//         path: "planId",
//         select: "title price durationInDays"
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Transaction.countDocuments(filter);

//     res.json({
//       transactions,
//       pagination: {
//         currentPage: Number(page),
//         totalPages: Math.ceil(total / limit),
//         total,
//         limit: Number(limit)
//       }
//     });
//   } catch (err) {
//     console.error("Get transactions error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ===== REPORTS & ANALYTICS =====

// exports.getAnalytics = async (req, res) => {
//   try {
//     const { timeRange } = req.query;
//     const Session = require("../model/sessionSchema");

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

//     // ===== Total Revenue =====
//     const totalRevenueData = await Transaction.aggregate([
//       { $match: { status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const totalRevenue = totalRevenueData[0]?.total || 0;

//     // This month revenue
//     const thisMonthRevenueData = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: startOfMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const thisMonthRevenue = thisMonthRevenueData[0]?.total || 0;

//     // Last month revenue
//     const lastMonthRevenueData = await Transaction.aggregate([
//       { 
//         $match: { 
//           status: "completed",
//           createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
//         } 
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);
//     const lastMonthRevenue = lastMonthRevenueData[0]?.total || 0;

//     const revenueChange = lastMonthRevenue > 0
//       ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
//       : 0;

//     // ===== Active Sessions =====
//     const activeSessions = await Session.countDocuments({
//       createdAt: { $gte: startOfMonth },
//       status: { $ne: "cancelled" }
//     });

//     const lastMonthSessions = await Session.countDocuments({
//       createdAt: { $gte: lastMonth, $lte: endOfLastMonth },
//       status: { $ne: "cancelled" }
//     });

//     const sessionsChange = lastMonthSessions > 0
//       ? (((activeSessions - lastMonthSessions) / lastMonthSessions) * 100).toFixed(1)
//       : 0;

//     // ===== User Retention (users who logged in both this month and last month) =====
//     const activeThisMonth = await User.countDocuments({
//       updatedAt: { $gte: startOfMonth }
//     });

//     const activeLastMonth = await User.countDocuments({
//       updatedAt: { $gte: lastMonth, $lte: endOfLastMonth }
//     });

//     const totalUsers = await User.countDocuments({
//       role: { $in: ["developer", "mentor"] }
//     });

//     const retentionRate = totalUsers > 0
//       ? ((activeThisMonth / totalUsers) * 100).toFixed(1)
//       : 0;

//     const lastRetentionRate = totalUsers > 0
//       ? ((activeLastMonth / totalUsers) * 100).toFixed(1)
//       : 0;

//     const retentionChange = lastRetentionRate > 0
//       ? (retentionRate - lastRetentionRate).toFixed(1)
//       : 0;

//     // ===== Revenue Trend (last 6 months) =====
//     const revenueTrendData = [];
//     for (let i = 5; i >= 0; i--) {
//       const monthStart = new Date();
//       monthStart.setMonth(monthStart.getMonth() - i);
//       monthStart.setDate(1);
//       monthStart.setHours(0, 0, 0, 0);
      
//       const monthEnd = new Date(monthStart);
//       monthEnd.setMonth(monthEnd.getMonth() + 1);
      
//       const monthRevenue = await Transaction.aggregate([
//         { 
//           $match: { 
//             status: "completed",
//             createdAt: { $gte: monthStart, $lt: monthEnd }
//           } 
//         },
//         { $group: { _id: null, total: { $sum: "$amount" } } }
//       ]);
      
//       revenueTrendData.push({
//         month: monthStart.toLocaleString('default', { month: 'short' }),
//         revenue: monthRevenue[0]?.total || 0
//       });
//     }

//     // ===== User Growth (last 6 months) =====
//     const userGrowthData = [];
//     for (let i = 5; i >= 0; i--) {
//       const monthStart = new Date();
//       monthStart.setMonth(monthStart.getMonth() - i);
//       monthStart.setDate(1);
//       monthStart.setHours(0, 0, 0, 0);
      
//       const monthEnd = new Date(monthStart);
//       monthEnd.setMonth(monthEnd.getMonth() + 1);
      
//       const users = await User.countDocuments({
//         role: "developer",
//         createdAt: { $lt: monthEnd }
//       });
      
//       const mentors = await User.countDocuments({
//         role: "mentor",
//         createdAt: { $lt: monthEnd }
//       });
      
//       userGrowthData.push({
//         month: monthStart.toLocaleString('default', { month: 'short' }),
//         users,
//         mentors
//       });
//     }

//     res.json({
//       totalRevenue: {
//         value: totalRevenue,
//         change: revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`
//       },
//       activeSessions: {
//         value: activeSessions,
//         change: sessionsChange >= 0 ? `+${sessionsChange}%` : `${sessionsChange}%`
//       },
//       userRetention: {
//         value: parseFloat(retentionRate),
//         change: retentionChange >= 0 ? `+${retentionChange}%` : `${retentionChange}%`
//       },
//       revenueTrend: revenueTrendData,
//       userGrowth: userGrowthData,
//     });
//   } catch (err) {
//     console.error("Get analytics error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

