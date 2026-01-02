import React from "react";
import { Search } from "lucide-react"; // Only Search icon needed for the input field

export default function BookingFilter({ filter, setFilter }) {
  // Status options are defined exactly as in your original code
  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="
      /* Main Container: Clean Card look */
      bg-white 
      rounded-xl 
      shadow-lg 
      p-5 md:p-6 
      mb-8 
      border border-gray-100
      flex flex-col gap-5
    ">
      
      {/* Search Input Section */}
      <div className="flex items-center gap-4">
        
        {/* Search Input with Icon and Enhanced Styling */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by mentor, title, date..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            className="
              w-full 
              pl-10 pr-4 py-3 
              border-2 border-gray-200 
              rounded-xl 
              text-gray-700 
              focus:outline-none 
              focus:border-blue-500 
              focus:ring-1 
              focus:ring-blue-500 
              transition-all duration-300
            "
          />
        </div>
      </div>
      
      {/* Status Filter Section */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        
        <span className="text-sm font-semibold text-gray-700 mr-1 shrink-0">Filter:</span>
        
        {statusOptions.map(({ label, value }) => {
          const isActive = filter.status === value;
          
          return (
            <button
              key={value || 'all'}
              onClick={() => setFilter({ ...filter, status: value })}
              className={
                `
                  px-4 py-2 
                  rounded-full 
                  text-sm font-semibold 
                  border-2 
                  transition-all duration-300 
                  flex items-center gap-2 
                  hover:scale-[1.03] active:scale-[0.98] 
                  focus:outline-none
                ` +
                (isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400')
              }
            >
              {/* NOTE: Icons are intentionally omitted here to prevent the functional bug. */}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}