function getNextDayDate(dayName) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  if (!daysOfWeek.includes(dayName)) {
    throw new Error("Invalid day. Only Monday to Friday are allowed.");
  }

  const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const result = new Date(today);

  const dayIndex = allDays.indexOf(dayName);
  let diff = dayIndex - today.getDay();
  if (diff <= 0) diff += 7;
  result.setDate(today.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  // No time zone shifting in frontend version. Just return as is.
  return result;
}

export default getNextDayDate;
