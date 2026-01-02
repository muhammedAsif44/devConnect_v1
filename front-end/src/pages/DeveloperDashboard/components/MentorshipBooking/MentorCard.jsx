// import React from "react";
// import SlotBadge from "./SlotBadge";

// export default function MentorCard({ mentor }) {
//   // Try to get profile image from nested structure safely
//   const profileImage =
//     mentor?.mentorProfile?.profileImage ||
//     mentor?.profileImage ||
//     mentor?.avatar ||
//     null;

//   const initials = mentor?.name
//     ? mentor.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "M";

//   return (
//     <div className="bg-white rounded-xl shadow-sm border px-8 py-6 mb-8 transition hover:shadow-md">
//       {/* --- Header with image and name --- */}
//       <div className="flex items-center gap-5 mb-3">
//         {/* Profile Image or Fallback */}
//         {profileImage ? (
//           <img
//             src={profileImage}
//             alt={mentor.name}
//             className="w-14 h-14 rounded-full object-cover border border-gray-200"
//           />
//         ) : (
//           <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-500">
//             {initials}
//           </div>
//         )}

//         <div>
//           <div className="font-bold text-lg text-gray-800 flex items-center">
//             {mentor.name}
//             {mentor.mentorRating?.average && (
//               <span className="ml-2 text-yellow-600 font-semibold text-base">
//                 ★ {mentor.mentorRating.average.toFixed(1)}
//               </span>
//             )}
//           </div>
//           <div className="text-xs text-gray-500">
//             {mentor.mentorProfile?.experience || "Experience not specified"}
//           </div>

//           <div className="flex gap-2 mt-2 flex-wrap">
//             {(mentor.skills || []).map((skill) => (
//               <span
//                 key={skill._id || skill}
//                 className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200"
//               >
//                 {typeof skill === "string" ? skill : skill.name}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* --- Available Slots --- */}
//       <div className="mt-5">
//         <div className="text-sm font-semibold text-gray-700 mb-2">
//           Available Time Slots
//         </div>

//         <div className="flex gap-4 flex-wrap">
//           {(mentor.mentorProfile?.availability || []).flatMap((day) =>
//             day.slots.map((slot) => (
//               <SlotBadge
//                 key={slot._id}
//                 slot={slot}
//                 day={day}
//                 mentorId={mentor._id}
//                 availabilityId={day._id}
//               />
//             ))
//           )}

//           {(mentor.mentorProfile?.availability?.length === 0 ||
//             mentor.mentorProfile?.availability?.every(
//               (d) => d.slots.length === 0
//             )) && (
//             <span className="text-xs text-gray-400">No slots available</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import SlotBadge from "./SlotBadge";
import PremiumBadge from "../../../../components/shared/PremiumBadge";
import MentorBadge from "../../../../components/shared/MentorBadge";
 

export default function MentorCard({ mentor }) {
  if (!mentor) return null;

  const profile = mentor.mentorProfile || {};
  const profileImage =
    mentor.profilePhoto || mentor.profileImage || mentor.avatar || null;

  const initials = mentor?.name
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "M";

  const availability = profile.availability || [];
  const allSlots = availability.flatMap((day) => day.slots || []).filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Card Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt={mentor.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 group-hover:border-blue-300 transition-all shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {initials}
              </div>
            )}
            {/* Verified Badge for Mentors */}
            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 ring-2 ring-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Name & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              {mentor?.mentorRating?.average && (
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-yellow-200">
                  <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {mentor.mentorRating.average.toFixed(1)}
                </div>
              )}
              <PremiumBadge user={mentor} variant="small" />
              <MentorBadge user={mentor} variant="small" />
            </div>

            {/* Experience */}
            <p className="text-xs text-gray-600 font-medium mb-3">
              {profile.experience || "Experienced Professional"}
            </p>

            {/* Skills */}
            {(mentor.skills || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(mentor.skills || []).slice(0, 4).map((skill, i) => (
                  <span
                    key={skill._id || i}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100"
                  >
                    {typeof skill === "string" ? skill : skill.name}
                  </span>
                ))}
                {(mentor.skills || []).length > 4 && (
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                    +{(mentor.skills || []).length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Available Slots
            </h4>
            <span className="text-xs text-gray-500 font-medium">
              {allSlots.length} {allSlots.length === 1 ? 'slot' : 'slots'}
            </span>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {allSlots.length > 0 ? (
              availability.flatMap((day) =>
                (day.slots || []).map((slot) => (
                  <SlotBadge
                    key={slot._id}
                    slot={slot}
                    day={day}
                    mentorId={mentor._id}
                    availabilityId={day._id}
                  />
                ))
              )
            ) : (
              <div className="col-span-full text-center py-4">
                <p className="text-xs text-gray-400">No slots available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
