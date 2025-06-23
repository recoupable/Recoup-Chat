import { format } from "date-fns";

// Format date for revenue display (short format like "Jan 15")
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d");
  } catch {
    return dateString; // Fallback to original string if parsing fails
  }
};

// Format date for scheduled actions with time (e.g. "Jan 15, 2:30 PM")
export const formatScheduledActionDate = (dateString: string | null): string => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};
