import { useNavigate } from "react-router-dom";
import React from "react";
export default function Register({ onRegister }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fakeUser = { name: "New User", role: "user" };
    onRegister(fakeUser);
    navigate("/user");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[420px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full">
            <span className="text-blue-600 text-2xl">{`</>`}</span>
          </div>
          <h2 className="text-xl font-bold mt-3">Join DevMentor</h2>
          <p className="text-gray-500 text-sm">Create your account to start your mentorship journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-lg" required />
          <input type="text" placeholder="Username" className="w-full p-2 border rounded-lg" required />
          <input type="email" placeholder="Email Address" className="w-full p-2 border rounded-lg" required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded-lg" required />
          <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded-lg" required />

          <select className="w-full p-2 border rounded-lg" required>
            <option value="">Select your role</option>
            <option value="user">User</option>
            <option value="mentor">Mentor</option>
          </select>

          <textarea placeholder="Bio (Optional)" className="w-full p-2 border rounded-lg" rows={3}></textarea>
          <input type="text" placeholder="Skills (Optional)" className="w-full p-2 border rounded-lg" />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
