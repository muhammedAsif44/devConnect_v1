/**
 * Reusable component for displaying skill or filter tags.
 * It uses the getTagColor utility to provide varied styling.
 */
import React from 'react';
// FIX: Changing path from '../../utils/constants' to '../utils/constants'
// This attempts to navigate from /components/Tag/ up to /components/ and then over to /utils/
import { getTagColor } from '../../../utils/constants'; 

const Tag = ({ children, index = 0 }) => {
  // Use the utility function to get the correct Tailwind color classes
  const colorClasses = getTagColor(index);
  
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${colorClasses} transition-colors duration-150 ease-in-out cursor-pointer hover:shadow-sm`}
    >
      {children}
    </span>
  );
};

export default Tag;
