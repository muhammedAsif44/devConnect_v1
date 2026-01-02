import React from "react";

export default function MentorshipBanner({ imgSrc }) {
  return (
    <img
      src={imgSrc}
      alt="Mentorship Banner"
      className="w-full h-36 object-cover rounded mb-6 shadow"
    />
  );
}
