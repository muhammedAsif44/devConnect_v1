import React from "react";
import { Loader2 } from "lucide-react";
import Shimmer from "./Shimmer";

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  type = 'submit', // ✅ Default to "submit" so Formik works without extra prop
  ...props
}) => {
  const baseClasses =
    'w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm px-4 py-2';
  
  const variantClasses = {
    primary:
      'bg-[#043873] hover:bg-[#032f60] text-white focus:ring-[#043873] shadow-sm hover:shadow-md',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-[#043873]',
  };

  return (
    <button
      type={type} // ✅ Ensures Formik form submission works
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
