/**
 * Parses a CRON expression and converts it to human-readable format
 * 
 * @param cronExpression CRON expression string (e.g. "0 9 * * 1")
 * @returns Human-readable schedule description
 */
export const parseCronToHuman = (cronExpression: string): string => {
  try {
    // Basic CRON parsing - format: minute hour day month dayOfWeek
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) return cronExpression;

    const [minute, hour, day, month, dayOfWeek] = parts;

    // Handle common patterns
    if (minute === "0" && hour === "*" && day === "*" && month === "*" && dayOfWeek === "*") {
      return "Every hour";
    }
    
    if (minute !== "*" && hour !== "*" && day === "*" && month === "*" && dayOfWeek === "*") {
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      const time = new Date();
      time.setHours(hourNum, minuteNum);
      return `Daily at ${time.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      })}`;
    }

    if (minute !== "*" && hour !== "*" && day === "*" && month === "*" && dayOfWeek !== "*") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      const time = new Date();
      time.setHours(hourNum, minuteNum);
      
      if (dayOfWeek.includes(",")) {
        const dayNums = dayOfWeek.split(",").map(d => parseInt(d.trim()));
        const dayNames = dayNums.map(num => days[num]).join(", ");
        return `${dayNames} at ${time.toLocaleTimeString("en-US", { 
          hour: "numeric", 
          minute: "2-digit", 
          hour12: true 
        })}`;
      } else {
        const dayNum = parseInt(dayOfWeek);
        return `${days[dayNum]} at ${time.toLocaleTimeString("en-US", { 
          hour: "numeric", 
          minute: "2-digit", 
          hour12: true 
        })}`;
      }
    }

    if (minute === "0" && hour === "0" && day === "*" && month === "*" && dayOfWeek === "*") {
      return "Daily at midnight";
    }

    if (minute === "0" && hour === "*/6" && day === "*" && month === "*" && dayOfWeek === "*") {
      return "Every 6 hours";
    }

    // Handle minute intervals
    if (minute.startsWith("*/") && hour === "*" && day === "*" && month === "*" && dayOfWeek === "*") {
      const interval = parseInt(minute.substring(2));
      if (interval === 1) return "Every minute";
      if (interval === 5) return "Every 5 minutes";
      if (interval === 10) return "Every 10 minutes";
      if (interval === 15) return "Every 15 minutes";
      if (interval === 30) return "Every 30 minutes";
      return `Every ${interval} minutes`;
    }

    // Fallback to original if we can't parse
    return cronExpression;
  } catch {
    return cronExpression;
  }
};