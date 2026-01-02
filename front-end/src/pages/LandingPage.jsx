import React, { useEffect } from 'react';
import { Search, BookOpen, Video, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Search size={28} className="text-[#043873]" />,
      title: 'Find Mentors',
      description: 'Search by skill, experience, and rating to find the perfect mentor for your needs.',
    },
    {
      icon: <BookOpen size={28} className="text-[#043873]" />,
      title: 'Book Sessions',
      description: 'Schedule 1:1 sessions instantly based on mentor availability and your convenience.',
    },
    {
      icon: <Video size={28} className="text-[#043873]" />,
      title: 'Chat & Video Call',
      description: 'Seamlessly communicate with mentors and peers directly within the platform.',
    },
    {
      icon: <Users size={28} className="text-[#043873]" />,
      title: 'Join Groups',
      description: 'Collaborate with peers on exciting projects and study various topics together.',
    },
  ];

  const handleGetStarted = () => {
    toast.success("Redirecting to signup page...");
    setTimeout(() => {
      navigate('/signup');
    }, 1000);
  };

  const handleLogin = () => {
    toast.success("Redirecting to login page...");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Show welcome toast when landing page loads
  useEffect(() => {
    toast("Welcome to DevConnect - Connect with developers and mentors!", {
      icon: "👋",
      duration: 4000
    });
  }, []);

  return (
    <div className="bg-white font-sans text-gray-800 min-h-screen flex flex-col">
      {/* --- Header --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#043873] flex items-center justify-center">
              <span className="text-white font-bold text-lg">DC</span>
            </div>
            <h1 className="text-2xl font-bold text-[#043873]">DevConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogin}
              className="px-4 py-2 text-[#043873] font-semibold hover:bg-blue-50 rounded-lg transition-colors"
            >
              Login
            </button>
            <button 
              onClick={handleGetStarted}
              className="px-6 py-2 bg-[#043873] text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center"
            >
              Get Started <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="flex-grow flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-[#043873] leading-tight mb-6">
              Connect with <span className="text-blue-600">Developers</span> & <span className="text-purple-600">Mentors</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Join our community to find mentors, book sessions, collaborate on projects, and accelerate your tech career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#043873] text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                Join Now <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="px-8 py-3 border-2 border-[#043873] text-[#043873] font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl transform rotate-6"></div>
              <div className="absolute top-6 -right-6 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl transform -rotate-6"></div>
              <div className="absolute top-3 -right-3 w-80 h-80 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white"></div>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Join 10K+ Developers</h3>
                  <p className="text-gray-600">Growing community of tech professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#043873] mb-4">Why Choose DevConnect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to connect, learn, and grow in your tech career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-16 bg-gradient-to-r from-[#043873] to-blue-800 text-white">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers and mentors who are already growing together on DevConnect.
          </p>
          <button 
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-[#043873] font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center mx-auto"
          >
            Get Started Now <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-[#043873] flex items-center justify-center">
                <span className="text-white font-bold text-lg">DC</span>
              </div>
              <h3 className="text-2xl font-bold">DevConnect</h3>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 DevConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}