import React from "react";
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle, Award, Sparkles } from "lucide-react";
import { useCallStore } from "../../../../ZustandStore/callStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore"; // Fixed import path

export default function BookingCard({ session, showMenteeInfo = false, showActions = false, onComplete, onCancel, onChat }) {
    const { startVideoCall } = useCallStore();
    const { user } = useAuthStore(); // Get user

    if (!session || !(session.mentorId || session.mentor)) return null;

    const mentor = session.mentorId || session.mentor || {};
    if (!mentor.name) return null;
    const mentee = session.menteeId || session.mentee || {};

    // Determine the counterparty for calls/chats based on context
    // If showMenteeInfo is true (Mentor looking at bookings), they interact with Mentee
    // Otherwise (Developer looking at bookings), they interact with Mentor
    const remoteUser = showMenteeInfo ? mentee : mentor;

    const status = (session.status || '').toLowerCase();

    // ... (Status styling remains same) ...
    let statusStyle = 'bg-gray-100 text-gray-600';
    let statusIcon = null;
    let statusDot = 'bg-gray-400';

    if (status === 'completed') {
        statusStyle = 'bg-emerald-50 text-emerald-700';
        statusIcon = <CheckCircle className="w-3.5 h-3.5 mr-1" />;
        statusDot = 'bg-emerald-500';
    } else if (status === 'cancelled') {
        statusStyle = 'bg-red-50 text-red-700';
        statusIcon = <XCircle className="w-3.5 h-3.5 mr-1" />;
        statusDot = 'bg-red-500';
    } else { // Scheduled/Pending
        statusStyle = 'bg-blue-50 text-blue-700';
        statusIcon = <Clock className="w-3.5 h-3.5 mr-1" />;
        statusDot = 'bg-blue-500';
    }

    const menteeName = mentee.name || "Unknown Mentee";
    const menteePhoto = mentee.profilePhoto;
    const menteeInitials = menteeName[0]?.toUpperCase() || "M";
    const mentorName = mentor.name || "Unknown Mentor";
    const mentorPhoto = mentor.profilePhoto;
    const mentorInitials = mentorName[0]?.toUpperCase() || "M";
    const mentorExperience = mentor.mentorProfile?.experience || mentor.title || "Experience not provided";

    // ... (Skill extraction & Date formatting remains same) ...
    let mentorSkills = [];
    if (Array.isArray(mentor.skills) && mentor.skills.length > 0) {
        mentorSkills = mentor.skills.map(skill => typeof skill === "string" ? skill : skill?.name);
    } else if (Array.isArray(mentor.mentorProfile?.expertise)) {
        mentorSkills = mentor.mentorProfile.expertise.map(skill => typeof skill === "string" ? skill : skill?.name);
    }
    const sessionTopic = mentorSkills[0] ? `${mentorSkills[0]} Session` : "General Mentorship Session";

    let dateString = "";
    const bookingDate = session.date || session.sessionDate;
    if (bookingDate) {
        try {
            const dateObj = new Date(bookingDate);
            if (!isNaN(dateObj.getTime())) {
                dateString = dateObj.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Kolkata",
                });
            }
        } catch { /* empty */ }
    }
    const slotString = session.slot || session.time || (session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : "Time not specified");

    // Helper function for Avatar
    const renderAvatar = (photo, initials, name, sizeClass) => (
        photo ? (
            <img
                src={photo}
                alt={name}
                className={`${sizeClass} rounded-full object-cover shadow-md transition-all duration-200 hover:scale-105`}
            />
        ) : (
            <div className={`${sizeClass} rounded-full bg-blue-500 flex items-center justify-center text-white text-base font-semibold shadow-md transition-all duration-200 hover:scale-105`}>
                {initials[0]}
            </div>
        )
    );

    const isScheduled = status === 'scheduled' || status === 'pending';

    const handleVideoCall = () => {
        if (remoteUser && remoteUser._id) {
            const myId = String(user?._id || "").trim();
            const remoteId = String(remoteUser._id || "").trim();



            if (myId === remoteId) {
                alert("You cannot call yourself!");
                return;
            }


            startVideoCall(remoteUser);
        } else {
            console.error("No valid remote user to call in BookingCard");
        }
    };

    return (
        <div className="
            bg-white 
            rounded-xl 
            shadow-xl 
            border border-gray-200 
            p-6 
            mb-6 
            overflow-hidden 
            transition-all duration-300 
            hover:shadow-2xl hover:border-blue-300 hover:translate-y-[-2px]
        ">

            {/* Main Content Area - Horizontal Layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                {/* 1. LEFT SECTION (Mentor Info & Topic) */}
                <div className="flex items-center gap-4 min-w-0 md:w-3/5">

                    {/* Mentor Avatar */}
                    {renderAvatar(mentorPhoto, mentorInitials, mentorName, "w-14 h-14 flex-shrink-0")}

                    <div className="flex flex-col min-w-0 flex-1">

                        {/* Mentor Name */}
                        <h3 className="text-lg font-bold text-gray-900 leading-snug truncate">
                            {mentorName}
                        </h3>
                        {/* Experience/Title */}
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 truncate">
                            <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{mentorExperience}</span>
                        </p>

                        {/* Session Topic / Main Skill */}
                        <div className="text-sm text-blue-600 bg-blue-50 font-medium px-3 py-1 rounded-full w-fit mt-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{sessionTopic}</span>
                        </div>
                    </div>
                </div>

                {/* 2. MIDDLE SECTION (Date & Time) */}
                <div className="
                    flex items-center justify-center
                    md:w-1/4 min-w-[200px] 
                    md:border-l border-gray-200 
                    pt-3 md:pt-0 pl-0 md:pl-6
                ">
                    <div className="
                        bg-gray-50 
                        rounded-lg 
                        p-3 
                        w-full 
                        shadow-inner 
                        border border-gray-100
                        space-y-2
                    ">
                        {/* Date Block */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-gray-500 font-medium leading-tight">Date</span>
                                <span className="text-sm font-bold text-gray-900 truncate">{dateString || "Date N/A"}</span>
                            </div>
                        </div>

                        {/* Time Block */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-gray-500 font-medium leading-tight">Time</span>
                                <span className="text-sm font-bold text-gray-900 truncate">{slotString.split(' ')[0] || "Time N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT SECTION (Status & Actions) */}
                <div className="flex gap-3 md:w-1/5 flex-shrink-0 items-center justify-end">

                    {/* Status Tag */}
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full inline-flex items-center ${statusStyle} flex-shrink-0 transition-all duration-300 hidden md:inline-flex`}>
                        <span className={`w-2 h-2 rounded-full ${statusDot} mr-2 animate-pulse`}></span>
                        {statusIcon}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>

                    {/* Join Call Button */}
                    <button
                        onClick={handleVideoCall}
                        className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${isScheduled
                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg hover:scale-110 active:scale-95'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'
                            }`}
                        disabled={!isScheduled}
                        title="Join Call"
                    >
                        <Video className="w-5 h-5" />
                    </button>

                    {/* Chat Button */}
                    <button
                        onClick={() => {
                            if (onChat) {
                                onChat(remoteUser);
                            }
                        }}
                        className={`p-2.5 rounded-lg transition-all duration-200 border-2 ${isScheduled
                            ? 'bg-white text-gray-600 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:scale-110 active:scale-95'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
                            }`}
                        disabled={!isScheduled}
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>

                    {/* Admin Actions (Larger Icons) */}
                    {showActions && isScheduled && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onComplete && onComplete(session._id)}
                                className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 hover:scale-110"
                                title="Complete"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onCancel && onCancel(session._id)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                title="Cancel"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MENTEE INFO (If showMenteeInfo is true) - Subtler Row (Larger font: text-sm) */}
            {
                showMenteeInfo && (
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 w-full text-sm">
                        <span className="font-semibold text-gray-700 shrink-0">Mentee:</span>
                        {renderAvatar(menteePhoto, menteeInitials, menteeName, "w-7 h-7")}
                        <span className="text-gray-800 font-medium truncate">{menteeName}</span>
                    </div>
                )
            }
        </div >
    );
}