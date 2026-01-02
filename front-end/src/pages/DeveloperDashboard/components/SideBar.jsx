import React from 'react';

/**
 * Renders a clickable item for the sidebar navigation with a modern social media aesthetic.
 * * Note: The component correctly uses 'Icon' (capitalized) which is destructured from the 'icon' prop.
 */
// eslint-disable-next-line no-unused-vars
const SidebarLink = ({ icon: Icon, name, isActive, onClick, isCollapsed }) => {
  // Removed previously undefined variables like 'socialBlue' and 'darkBackground'.
  const itemHeight = 'h-11'; // Set a consistent height for better touch targets

  return (
    <button
      onClick={onClick}
      // Base styles: flex layout, consistent padding/height, full width, rounded corners
      className={`
        flex items-center p-3 transition-all duration-200 ease-in-out w-full
        rounded-xl group relative // Added 'relative' for the active indicator positioning
        ${itemHeight} 
        
        ${isCollapsed ? 'justify-center space-x-0' : 'space-x-4'}
        
        // Inactive State (Default)
        ${!isActive 
          ? `text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50`
          : ''
        }
        
        // Active State (Modern Pop)
        ${isActive
          // Using hardcoded strings instead of undefined variables
          ? `bg-blue-600/20 text-blue-400 font-bold` // Subtle filled background with primary color text
          : ''
        }
      `}
    >
      {/* Icon */}
      <Icon 
        className={`
          w-5 h-5 shrink-0 transition-colors
          ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}
        `} 
      />
      
      {/* Link Name */}
      {!isCollapsed && (
        <span 
          className={`
            text-sm whitespace-nowrap overflow-hidden transition-colors
            ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
          `}
        >
          {name}
        </span>
      )}
      
      {/* Active Indicator (Optional: small vertical bar for a subtle, modern touch) */}
      {isActive && !isCollapsed && (
          <div className={`
              absolute right-0 w-1 h-full rounded-l-md bg-blue-500
          `}/>
      )}
    </button>
  );
};

export default SidebarLink;