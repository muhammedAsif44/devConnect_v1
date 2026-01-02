import React from "react";

// eslint-disable-next-line no-unused-vars
const InteractionButton = ({ icon: Icon, count, label, onClick, colorClass = "hover:text-sky-500" }) => (
 <button
  onClick={onClick}
  className={`flex items-center gap-2 transition-colors font-medium ${colorClass}`}
>
    <Icon className="w-5 h-5" />
    <span className="text-sm">{count}</span>
    <span className="sr-only">{label}</span>
  </button>
);

export default InteractionButton;
