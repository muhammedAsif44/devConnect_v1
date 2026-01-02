import React from "react";

// Usage: <ProfileAvatar photo={photo} name={name} className="w-36 h-36 border-4" />
export default function ProfileAvatar({ photo, name, className = "" }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";
  return (
    <div className={`rounded-full overflow-hidden shadow-xl flex items-center justify-center font-bold text-4xl bg-[#032f60] text-white ${className}`}>
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="object-cover w-full h-full"
          onError={e => {
            e.target.onerror = null;
            e.target.style.display = "none";
            e.target.parentElement.textContent = initials;
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
