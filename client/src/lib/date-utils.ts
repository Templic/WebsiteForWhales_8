import { format, parseISO, isValid } from "date-fns";

export const formatDisplayDate = (date: string | Date | null | undefined) => {
  if (!date) return "Recent";
  
  try {
    // Handle different types: string or Date object
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, 'MMM dd, yyyy') : "Recent";
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Recent";
  }
};
