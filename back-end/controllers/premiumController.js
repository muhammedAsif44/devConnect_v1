const crypto = require("crypto");
const Plan = require("../model/planSchema");
const User = require("../model/userSchema");
const Transaction = require("../model/transactionSchema");
const razorpay = require("../config/razorpay");

// ===== GET ALL PLANS =====
// exports.getPlans = async (req, res) => {
//   try {
//     const plans = await Plan.find({ isActive: true }).select("-__v");
//     res.status(200).json({ plans });
//   } catch (err) {
//     console.error("Get Plans Error:", err);
//     res.status(500).json({ message: "Server error fetching plans" });
//   }
// };

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).select("-__v");
    res.status(200).json({ plans });
  } catch (err) {
    console.error("Get Plans Error:", err);
    res.status(500).json({ message: "Server error fetching plans" });
  }
};

// ===== CREATE RAZORPAY ORDER =====
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const options = {
      amount: plan.price * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planId: plan._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// ===== VERIFY PAYMENT (ACTIVATE PREMIUM) =====
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const userId = req.user._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Create failed transaction record
      await Transaction.create({
        userId,
        planId,
        transactionId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: 0,
        status: "failed",
      });
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Fetch plan
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // ✅ Update user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);

    user.isPremium = true;
    user.premiumExpiresAt = expiresAt;
    await user.save();

    // ✅ Create successful transaction record
    await Transaction.create({
      userId,
      planId,
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: plan.price,
      currency: "INR",
      status: "completed",
      type: "premium_subscription",
    });

    res.status(200).json({
      message: "Payment verified and premium activated",
      user: {
        _id: user._id,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ message: "Server error verifying payment" });
  }
};
