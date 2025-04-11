import { format, isToday, isYesterday, isTomorrow, addDays, isSameDay } from "date-fns";

// Format a date as a relative day (Today, Tomorrow, Yesterday) or full date
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, "h:mm a")}`;
  }
  if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, "h:mm a")}`;
  }
  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, "h:mm a")}`;
  }
  
  // If it's within the next 6 days, show the day name
  const today = new Date();
  const maxDayToShow = addDays(today, 6);
  
  if (dateObj > today && dateObj <= maxDayToShow) {
    return format(dateObj, "EEEE, h:mm a");
  }
  
  // Otherwise show the full date
  return format(dateObj, "MMM d, yyyy, h:mm a");
};

// Format seconds into a human-readable time format (HH:MM:SS)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Format seconds into a human-readable duration (e.g., "2 hours 30 minutes")
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  
  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMins} minute${
    remainingMins !== 1 ? "s" : ""
  }`;
};

// Get start and end dates for the current week
export const getCurrentWeekDates = (): { start: Date; end: Date } => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};
