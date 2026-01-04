import React from "react";
import { Mail, Lock } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../components/Button";
import InputField from "../components/InputField";
import useAuthStore from "../ZustandStore/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Role-based redirect logic
  const redirectByRole = (role) => {
    switch (role) {
      case "developer":
        navigate("/developer-dashboard");
        break;
      case "mentor":
        navigate("/mentor-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const user = await login(values);
      // Login successful, toast already handled in store (or here)
      // Immediate redirect based on API response
      if (user && user.role) {
        redirectByRole(user.role);
      } else {
        // Fallback if role is missing
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Toast handled in store, but we can set form errors
      if (error.response?.data?.message) {
        setErrors({
          email: error.response.data.message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Branding */}
        <div className="w-full md:w-2/5 bg-[#043873] text-white p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white text-[#043873] font-bold text-xl rounded-md px-4 py-2 mb-6">
            DC
          </div>
          <h1 className="text-3xl font-bold mb-3">DevConnect</h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Connect with developers, mentors, and build amazing projects together.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-3/5 p-6 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to your DevConnect account.</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <InputField label="Email Address" name="email" type="email" icon={Mail} />
                  <InputField label="Password" name="password" type="password" icon={Lock} />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        className="h-4 w-4 text-[#043873] focus:ring-[#043873] border-gray-300 rounded"
                      />
                      <span>Remember me</span>
                    </label>
                    <a
                      href="/forgotpassword"
                      className="font-semibold text-[#043873] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don’t have an account?{" "}
              <a href="/signup" className="font-semibold text-[#043873] hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
