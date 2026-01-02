const Transaction = require("../model/transactionSchema");

// Get revenue statistics
exports.getRevenueStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const totalRevenue = await Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const thisMonthRevenue = await Transaction.aggregate([
      { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const lastMonthRevenue = await Transaction.aggregate([
      { $match: { status: "completed", createdAt: { $gte: lastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const total = totalRevenue[0]?.total || 0;
    const thisMonth = thisMonthRevenue[0]?.total || 0;
    const lastMonthTotal = lastMonthRevenue[0]?.total || 0;

    const percentageChange = lastMonthTotal > 0
      ? (((thisMonth - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
      : 0;

    res.json({
      totalRevenue: total,
      thisMonthRevenue: thisMonth,
      lastMonthRevenue: lastMonthTotal,
      percentageChange: Number(percentageChange),
    });
  } catch (err) {
    console.error("Get revenue stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get recent transactions
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .populate({ path: "userId", select: "name email profilePhoto" })
      .populate({ path: "planId", select: "title price durationInDays" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
        limit: Number(limit)
      }
    });
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
