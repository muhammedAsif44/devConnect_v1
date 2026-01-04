import React, { useState } from "react";
import { User, Mail, Lock, Code, KeyRound } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/InputField";
import SelectDropdown from "../components/SelectDropdown";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../ZustandStore/useAuthStore";
import toast, { Toaster } from "react-hot-toast"; // ✅ correct import
import api from "../api/axios";

const roleOptions = [
  { value: "developer", label: "Developer" },
  { value: "mentor", label: "Mentor" },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const defaultSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "01:00-02:00", "02:00-03:00"];

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
  role: Yup.string().required("Role is required"),
  skills: Yup.string().optional(),
  experience: Yup.string().when("role", {
    is: "mentor",
    then: (schema) => schema.required("Experience is required for mentors"),
    otherwise: (schema) => schema.optional(),
  }),
  availability: Yup.array().when("role", {
    is: "mentor",
    then: (schema) => schema.of(Yup.string()).min(1, "Select at least one available slot"),
    otherwise: (schema) => schema.optional(),
  }),
  profilePhoto: Yup.mixed().optional(),
});

const OTPSchema = Yup.object().shape({
  otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

export default function Signup() {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role);

      if (values.skills) {
        const skillsArray = values.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (skillsArray.length) formData.append("skills", JSON.stringify(skillsArray));
      }

      if (values.role === "mentor") {
        if (values.availability.length) formData.append("availability", JSON.stringify(values.availability));
        if (values.experience) formData.append("experience", values.experience);
      }

      if (values.profilePhoto) formData.append("profilePhoto", values.profilePhoto);

      await signup(formData);
      toast.success("OTP sent successfully! Please check your email."); // ✅ success toast
      setUserEmail(values.email);
      setShowOtp(true);
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup failed!"); // ✅ error toast
      setErrors({
        email: error.response?.data?.message || error.message || "Signup failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      await api.post("/auth/verify-otp", { email: userEmail, otp: values.otp });
      toast.success("Signup verified successfully! Please login."); // ✅ toast on success
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP"); // ✅ toast for error
      setOtpError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ working toaster */}
      <div className="w-full max-w-5xl md:h-[90vh] md:max-h-[700px] flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Branding Panel */}
        <div className="w-full md:w-2/5 bg-[#043873] text-white p-8 md:p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white text-[#043873] font-bold text-xl rounded-md px-4 py-2 mb-6">DC</div>
          <h1 className="text-3xl font-bold mb-3">DevConnect</h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Join DevConnect and start collaborating with developers and mentors.
          </p>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col h-full bg-white">
          <div className="max-w-md mx-auto w-full flex flex-col h-full">
            {!showOtp ? (
              <>
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Sign up to get started.</p>
                </div>

                {/* Mobile: Allow full page scroll (remove overflow-y-auto/height constraints) */}
                <div className="flex-grow md:overflow-y-auto md:pr-4 md:-mr-4">
                  <Formik
                    initialValues={{
                      name: "",
                      username: "",
                      email: "",
                      password: "",
                      role: "",
                      skills: "",
                      experience: "",
                      availability: [],
                      profilePhoto: null,
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, isSubmitting }) => (
                      <Form className="space-y-4">
                        {/* Profile Photo */}
                        <div className="flex justify-center mb-6 relative">
                          <div className="relative w-28 h-28">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
                              {values.profilePhoto ? (
                                <img
                                  src={URL.createObjectURL(values.profilePhoto)}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="text-gray-400 w-12 h-12" />
                                </div>
                              )}
                            </div>

                            <label className="absolute -top-0 -right-1 w-10 h-10 bg-[#043873] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-all z-20">
                              <span className="text-2xl font-bold">+</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                  setFieldValue("profilePhoto", event.currentTarget.files[0])
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </label>
                          </div>
                        </div>

                        <InputField label="Full Name" name="name" icon={User} />
                        <InputField label="Username" name="username" icon={User} />
                        <InputField label="Email" name="email" type="email" icon={Mail} />
                        <InputField label="Password" name="password" type="password" icon={Lock} />
                        <SelectDropdown label="Role" name="role" options={roleOptions} />
                        <InputField
                          label="Skills (Optional, comma-separated)"
                          name="skills"
                          placeholder="React, Node.js, MongoDB"
                          icon={Code}
                        />

                        {/* Mentor Fields */}
                        <div
                          className={`transition-all duration-300 ease-in-out ${values.role === "mentor"
                            ? "max-h-[2000px] opacity-100 mt-2"
                            : "max-h-0 opacity-0 overflow-hidden mt-0"
                            }`}
                        >
                          <InputField
                            label="Experience"
                            name="experience"
                            placeholder="e.g., 5 years in backend"
                            icon={Code}
                          />
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-800">Availability</label>
                            {weekdays.map((day) => (
                              <div key={day}>
                                <p className="text-sm font-medium mb-1.5">{day}</p>
                                <div className="flex flex-wrap gap-2">
                                  {defaultSlots.map((slot) => {
                                    const slotValue = `${day} ${slot}`;
                                    const selected = values.availability.includes(slotValue);
                                    return (
                                      <label
                                        key={slotValue}
                                        className={`cursor-pointer text-sm px-3 py-1 rounded-full border transition-all duration-200 ${selected
                                          ? "bg-[#043873] text-white border-[#043873]"
                                          : "bg-white border-gray-300 hover:bg-gray-100"
                                          }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selected}
                                          onChange={() => {
                                            if (selected) {
                                              setFieldValue(
                                                "availability",
                                                values.availability.filter((v) => v !== slotValue)
                                              );
                                            } else {
                                              setFieldValue("availability", [
                                                ...values.availability,
                                                slotValue,
                                              ]);
                                            }
                                          }}
                                          className="hidden"
                                        />
                                        {slot}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="sticky bottom-0 pt-4 bg-white">
                          <Button type="submit" loading={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </>
            ) : (
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-600 mb-6">
                  An OTP was sent to <span className="font-semibold">{userEmail}</span>.
                </p>

                <Formik initialValues={{ otp: "" }} validationSchema={OTPSchema} onSubmit={handleVerifyOtp}>
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <InputField label="6-Digit OTP" name="otp" icon={KeyRound} />
                      {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                      <Button type="submit" loading={isSubmitting} className="w-full">
                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 mt-6 flex-shrink-0">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-[#043873] hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
