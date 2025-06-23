import { format } from "date-fns";

// Format date for revenue display (short format like "Jan 15")
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d");
  } catch {
    return dateString; // Fallback to original string if parsing fails
  }
};
