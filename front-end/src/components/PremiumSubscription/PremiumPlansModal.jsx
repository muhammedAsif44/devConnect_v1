import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios"; // your axios instance (withCredentials enabled)
import toast from "react-hot-toast";
import useAuthStore from "../../ZustandStore/useAuthStore";

export default function PremiumPlansModal({ isOpen, onClose }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const { fetchUserProfile } = useAuthStore();

  // Fetch plans when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchPlans = async () => {
        setLoading(true);
        try {
          const res = await api.get("/premium/plans", { withCredentials: true });
          setPlans(res.data.plans || []);
        } catch (err) {
          console.error("Error fetching plans:", err);
          toast.error("Failed to load plans");
        } finally {
          setLoading(false);
        }
      };
      fetchPlans();
    }
  }, [isOpen]);

  // Load Razorpay script once
  useEffect(() => {
    if (!window.Razorpay) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // already loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


const handleSubscribe = async (planId) => {
  try {
    setSubscribing(planId);

    //   Step 1: Load Razorpay SDK if not loaded
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK");
      setSubscribing(null);
      return;
    }

    //   Step 2: Create order on backend (protected)
    const createRes = await api.post(
      `/premium/create-order/${planId}`,
      {},
      { withCredentials: true }
    );

    const { order, key } = createRes.data;
    if (!order || !key) throw new Error("Order creation failed");

    //   Step 3: Open Razorpay Checkout
    const options = {
      key,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "DevConnect",
      description: "Premium Membership",
      order_id: order.id,
      handler: async (response) => {
        try {
          //   Step 4: Verify payment on backend
          await api.post(
            "/premium/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            },
            { withCredentials: true }
          );

          toast.success("Payment verified — premium activated 🎉");
          
          // Refresh user profile to update premium status
          await fetchUserProfile(true);
          
          // Close modal after short delay
          setTimeout(() => {
            onClose();
          }, 1000);
        } catch (verifyErr) {
          console.error("Verification failed:", verifyErr);
          toast.error("Payment verification failed. Contact support.");
        }
      },
      prefill: {
        name: "", // optional: get from user
        email: "",
      },
      theme: { color: "#2563EB" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (res) => {
      console.error("Payment failed:", res);
      toast.error("Payment failed or cancelled");
    });

    rzp.open();
  } catch (err) {
    console.error("Subscription error:", err);
    toast.error(err.response?.data?.message || err.message || "Subscription failed");
  } finally {
    setSubscribing(null);
  }
};


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
            <p className="text-gray-600 text-sm">Unlock mentorship booking features</p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No plans available.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan._id} className="border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  <p className="text-sm text-gray-600 my-2">{plan.description}</p>
                  <ul className="text-sm text-gray-700 mb-3">
                    {plan.features?.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold">₹{plan.price}
                    <span className="text-sm text-gray-500"> / {plan.durationInDays} days</span>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={subscribing === plan._id}
                    className={`mt-3 w-full py-2 rounded-lg text-white ${subscribing === plan._id ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {subscribing === plan._id ? "Processing..." : "Subscribe"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
