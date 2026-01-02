import React from "react";

const Shimmer = ({ className = "", type = "default" }) => {
  const baseClasses = "animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const typeClasses = {
    default: "h-4",
    card: "h-32",
    circle: "h-10 w-10 rounded-full",
    button: "h-10",
    text: "h-4",
    profile: "h-16 w-16 rounded-full",
    line: "h-2",
    large: "h-64"
  };
  
  const classes = `${baseClasses} ${typeClasses[type] || typeClasses.default} ${className}`;
  
  return <div className={classes} />;
};

export default Shimmer;