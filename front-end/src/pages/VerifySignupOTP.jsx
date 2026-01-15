import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../api/axios";
import { KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../ZustandStore/useAuthStore"; // ✅ Zustand store
import toast from "react-hot-toast";

const OTPSchema = Yup.object().shape({
  otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

export default function VerifySignupOTP() {
  const { user } = useAuthStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (values, { setSubmitting }) => {
    try {
      await api.post("/auth/verify-otp", { email: user.email, otp: values.otp });

      // ✅ FIX: Dismiss any existing toasts before showing new one
      toast.dismiss();

      // ✅ FIX: Use shorter duration (2 seconds) so it doesn't persist on next page
      toast.success("Signup verified successfully! Redirecting to login...", {
        duration: 2000,
        id: 'verify-success' // unique ID prevents duplicates
      });

      // ✅ FIX: Small delay before navigation so user sees the toast
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
      toast.error(msg, { duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">An OTP was sent to {user.email}</p>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={OTPSchema}
          onSubmit={handleVerify}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <InputField label="6-Digit OTP" name="otp" icon={KeyRound} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" loading={isSubmitting} className="w-full">
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
