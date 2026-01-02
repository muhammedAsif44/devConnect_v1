const Report = require("../model/reportSchema");
const Post = require("../model/postSchema");

// Get all reported posts
exports.getReportedPosts = async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;
    const filter = { entityType: "Post" };
    if (status !== "all") filter.status = status;

    const skip = (page - 1) * limit;

    const reports = await Report.find(filter)
      .populate({
        path: "entityId",
        model: "Post",
        populate: {
          path: "userId",
          select: "name email profilePhoto"
        }
      })
      .populate("reportedBy", "name email profilePhoto")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const reportsByPost = {};
    reports.forEach(report => {
      if (!report.entityId) return;
      const postId = report.entityId._id.toString();
      if (!reportsByPost[postId]) {
        reportsByPost[postId] = {
          _id: postId,
          post: report.entityId,
          reports: [],
          totalReports: 0,
          reasons: {}
        };
      }

      reportsByPost[postId].reports.push({
        _id: report._id,
        reportedBy: report.reportedBy,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt
      });

      reportsByPost[postId].totalReports++;
      reportsByPost[postId].reasons[report.reason] = 
        (reportsByPost[postId].reasons[report.reason] || 0) + 1;
    });

    const reportedPosts = Object.values(reportsByPost);
    const total = await Report.countDocuments(filter);

    const pendingCount = await Report.countDocuments({ entityType: "Post", status: "pending" });
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const removedToday = await Report.countDocuments({ entityType: "Post", status: "removed", reviewedAt: { $gte: startOfToday } });

    res.json({
      reportedPosts,
      stats: { pending: pendingCount, total: await Report.countDocuments({ entityType: "Post" }), removedToday },
      pagination: { currentPage: Number(page), totalPages: Math.ceil(total / limit), total }
    });
  } catch (err) {
    console.error("Get reported posts error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Review/Dismiss a report
exports.reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, adminNotes } = req.body;

    if (!action || !["dismiss", "remove"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'dismiss' or 'remove'" });
    }

    const report = await Report.findById(reportId).populate("entityId");
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = action === "dismiss" ? "dismissed" : "removed";
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;
    await report.save();

    if (action === "remove" && report.entityId) {
      const post = await Post.findById(report.entityId._id);
      if (post) {
        post.isRemoved = true;
        post.moderatedAt = new Date();
        await post.save();
      }
    }

    res.json({ message: `Report ${action === "dismiss" ? "dismissed" : "removed"} successfully`, report });
  } catch (err) {
    console.error("Review report error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove post (admin action)
exports.removeReportedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { adminNotes } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.isRemoved = true;
    post.moderatedAt = new Date();
    await post.save();

    await Report.updateMany(
      { entityType: "Post", entityId: postId, status: "pending" },
      { status: "removed", reviewedBy: req.user._id, reviewedAt: new Date(), adminNotes: adminNotes || "Post removed by admin" }
    );

    res.json({ message: "Post removed successfully" });
  } catch (err) {
    console.error("Remove post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Dismiss all reports for a post
exports.dismissReports = async (req, res) => {
  try {
    const { postId } = req.params;
    const { adminNotes } = req.body;

    const result = await Report.updateMany(
      { entityType: "Post", entityId: postId, status: "pending" },
      { status: "dismissed", reviewedBy: req.user._id, reviewedAt: new Date(), adminNotes: adminNotes || "Reports dismissed by admin" }
    );

    res.json({ message: "Reports dismissed successfully", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Dismiss reports error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
