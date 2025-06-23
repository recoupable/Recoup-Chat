import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

/**
 * Format a cron expression into a human-readable schedule description
 */
export const formatCronSchedule = (cronExpression: string): string => {
  // Common cron patterns and their human-readable equivalents
  const cronPatterns: Record<string, string> = {
    "0 0 * * *": "Daily at midnight",
    "0 0 * * 0": "Weekly on Sunday at midnight", 
    "0 0 1 * *": "Monthly on the 1st at midnight",
    "0 9 * * 1-5": "Weekdays at 9:00 AM",
    "0 */6 * * *": "Every 6 hours",
    "0 */12 * * *": "Every 12 hours",
    "*/30 * * * *": "Every 30 minutes",
    "0 0 */2 * *": "Every 2 days at midnight",
  };

  // Return human-readable format if pattern is recognized
  if (cronPatterns[cronExpression]) {
    return cronPatterns[cronExpression];
  }

  // For unrecognized patterns, return the cron expression
  return `Cron: ${cronExpression}`;
};

/**
 * Format the scheduled actions count for display
 */
export const formatActionsCount = (count: number): string => {
  if (count === 0) return "No actions";
  if (count === 1) return "1 action";
  return `${count} actions`;
};

/**
 * Get the status display text for a scheduled action
 */
export const getActionStatus = (action: ScheduledAction): string => {
  if (action.enabled === false) return "Disabled";
  return "Active";
};

/**
 * Get a truncated version of the prompt for display
 */
export const truncatePrompt = (prompt: string, maxLength: number = 100): string => {
  if (prompt.length <= maxLength) return prompt;
  return `${prompt.substring(0, maxLength)}...`;
};

/**
 * Validate if a cron expression is likely valid (basic validation)
 */
export const isValidCronExpression = (cron: string): boolean => {
  const parts = cron.trim().split(/\s+/);
  return parts.length === 5;
};