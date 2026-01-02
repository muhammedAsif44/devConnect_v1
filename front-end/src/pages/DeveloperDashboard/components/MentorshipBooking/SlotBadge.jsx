import React, { useState } from "react";
import useMentorshipStore from "../../../../ZustandStore/mentorshipStore";
import useAuthStore from "../../../../ZustandStore/useAuthStore";
import toast from "react-hot-toast";

function getSlotDayLabel(slot, day) {
  let label = "";
  if (slot.date) {
    try {
      const jsDate = new Date(slot.date);
      label = jsDate.toLocaleDateString("en-US", { weekday: "short" });
      return label;
    } catch { /* empty */ }
  }
  if (day && day.day) return day.day;
  return "Day?";
}

function getSlotTimeLabel(slot) {
  if (slot.time) return slot.time;
  if (slot.startTime && slot.endTime) return `${slot.startTime} - ${slot.endTime}`;
  if (slot.startTime) return slot.startTime;
  return "Time?";
}

function getBackendDate(slot, day) {
  if (slot.date) return slot.date;
  if (day && day.day) {
    try {
      const targetDay = day.day;
      const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      let dayNum = allDays.indexOf(targetDay);
      let diff = dayNum - today.getDay();
      if (diff <= 0) diff += 7;
      let candidate = new Date(today);
      candidate.setDate(today.getDate() + diff);
      return candidate.toISOString().slice(0, 10);
    } catch { /* empty */ }
  }
  return null;
}

export default function SlotBadge({ slot, day, mentorId, availabilityId }) {
  const { bookSession, fetchMentors } = useMentorshipStore();
  const { user } = useAuthStore();
  const [isBooking, setIsBooking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const isUserReady = !!(user && user._id);

  const slotDay = getSlotDayLabel(slot, day);
  const slotTime = slot?.time || getSlotTimeLabel(slot);
  const backendDate = getBackendDate(slot, day);

  const bookedByYou =
    slot.isBooked && slot.bookedBy && user && String(slot.bookedBy) === String(user._id);

  const handleBook = async () => {
    if (!user || !user._id) {
      toast.error("You must be logged in to book a session.");
      return;
    }
    if (!backendDate || !slotTime) {
      toast.error("Cannot book: missing date or time for this slot.");
      return;
    }
    setIsBooking(true);
    try {
      await bookSession(mentorId, user._id, availabilityId, slotTime, backendDate, slot?._id);
      toast.success(`Session booked for ${slotDay} at ${slotTime}`);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error("This slot was just booked by someone else. Refreshing...");
        setIsSyncing(true);
        try {
          await fetchMentors();
        } finally {
          setIsSyncing(false);
        }
      } else {
        toast.error(err?.response?.data?.message || "Failed to book session.");
      }
    } finally {
      if (!isSyncing) await fetchMentors();
      setIsBooking(false);
    }
  };

  // If slot is already booked
  if (slot.isBooked) {
    return (
      <div
        className={`relative rounded-lg px-3 py-2.5 text-xs border select-none transition-all flex flex-col items-start justify-between ${
          bookedByYou
            ? "bg-green-50 border-green-300 text-green-900 shadow-sm"
            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <div>
          <span className="font-semibold">{slotDay}</span>
          <div className="text-[10px] opacity-75">{slotTime}</div>
        </div>
        <span
          className={`mt-2 text-[11px] font-semibold px-2 py-1 rounded ${
            bookedByYou ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {bookedByYou ? "Booked (Yours)" : "Booked"}
        </span>
      </div>
    );
  }

  // Available slot
  return (
    <button
      onClick={handleBook}
      disabled={isBooking || isSyncing || !isUserReady}
      className={`relative rounded-lg px-3 py-2.5 text-left border transition-all flex flex-col justify-between duration-200 ${
        isBooking || isSyncing || !isUserReady
          ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
          : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-md hover:bg-blue-50"
      }`}
    >
      <div>
        <span className="font-semibold text-gray-900 text-xs">{slotDay}</span>
        <div className="text-[10px] text-gray-600">{slotTime}</div>
      </div>
      <span
        className={`mt-2 text-[11px] font-semibold px-2 py-1 rounded ${
          isBooking
            ? "bg-gray-300 text-gray-700"
            : "bg-green-600 hover:bg-green-700 text-white transition-colors"
        }`}
      >
        {isBooking ? "Booking..." : "Book"}
      </span>
    </button>
  );
}
