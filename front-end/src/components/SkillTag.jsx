import React from 'react';

/**
 * Tag component for skills.
 */
const Tag = ({ children, color = 'blue' }) => {
  const colorMap = {
    'blue': 'bg-blue-100 text-blue-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'green': 'bg-green-100 text-green-800',
    'red': 'bg-red-100 text-red-800',
    'cyan': 'bg-cyan-100 text-cyan-800',
  };
  const bgColor = colorMap[color] || colorMap['blue'];

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${bgColor} mr-2 transition-all duration-150 cursor-pointer hover:shadow-sm`}>
      {children}
    </span>
  );
};

export default Tag;