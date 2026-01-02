import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  backTo = '/',
  className = '' 
}) => {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="relative z-10">
        {showBackButton && (
          <div className="p-4 lg:p-6">
            <Link 
              to={backTo}
              className="inline-flex items-center text-gray-600 hover:text-[#043873] transition-colors text-sm"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Link>
          </div>
        )}
      </div>

      {/* Main Content - Fixed Height Layout */}
      <div className="flex h-screen">
        {/* Left Side - Fixed Branding (40% width) */}
        <div className="hidden lg:flex lg:w-2/5 bg-[#043873] items-center justify-center p-6">
          <div className="text-center text-white max-w-xs">
            <div className="mx-auto h-14 w-14 bg-white rounded-xl flex items-center justify-center mb-4">
              <span className="text-[#043873] font-bold text-xl">DC</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">DevConnect</h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Connect with developers, mentors, and build amazing projects together.
            </p>
          </div>
        </div>

        {/* Right Side - Fixed Auth Form (60% width) */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-4">
              <div className="mx-auto h-10 w-10 bg-[#043873] rounded-xl flex items-center justify-center mb-3">
                <span className="text-white font-bold text-lg">DC</span>
              </div>
            </div>

            {/* Compact Form Header */}
            <div className="text-center mb-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Fixed Height Auth Form Container */}
            <div className={`
              bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex-1 flex flex-col justify-center
              ${className}
            `}>
              {children}
            </div>

            {/* Compact Footer */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                © 2024 DevConnect. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
