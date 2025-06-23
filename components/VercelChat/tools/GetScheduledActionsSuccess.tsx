import React from "react";
import { Calendar, Clock, Play, Pause, ListTodo, CheckCircle2 } from "lucide-react";
import { GetScheduledActionsResult } from "@/lib/tools/scheduled_actions/getScheduledActions";

export interface GetScheduledActionsSuccessProps {
  result: GetScheduledActionsResult;
}

const GetScheduledActionsSuccess: React.FC<GetScheduledActionsSuccessProps> = ({
  result,
}) => {
  const { actions, message } = result;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseCronToHuman = (cronExpression: string): string => {
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

      if (minute === "*/15" && hour === "*" && day === "*" && month === "*" && dayOfWeek === "*") {
        return "Every 15 minutes";
      }

      if (minute === "*/30" && hour === "*" && day === "*" && month === "*" && dayOfWeek === "*") {
        return "Every 30 minutes";
      }

      // Fallback to original if we can't parse
      return cronExpression;
    } catch {
      return cronExpression;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h3 className="text-sm font-semibold text-gray-900">Scheduled Actions</h3>
        </div>
        <p className="text-xs text-gray-600 mt-1">{message}</p>
      </div>

      {/* Actions List */}
      <div className="p-4">
        {actions.length === 0 ? (
          <div className="text-center py-6">
            <ListTodo className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No scheduled actions found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {actions.map((action) => (
              <div
                key={action.id}
                className={`border rounded-lg p-4 transition-all ${
                  action.enabled 
                    ? "border-green-200 bg-green-50/30" 
                    : "border-gray-200 bg-gray-50/30"
                }`}
              >
                {/* Action Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {action.title}
                      </h4>
                      {action.enabled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Play className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <Pause className="h-3 w-3 mr-1" />
                          Paused
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Prompt */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {action.prompt}
                  </p>
                </div>

                {/* Schedule Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">Schedule:</span>
                    <span>{parseCronToHuman(action.schedule)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                    <span className="font-medium">Next run:</span>
                    <span>{formatDate(action.next_run)}</span>
                  </div>
                </div>

                {/* Last Run */}
                {action.last_run && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-medium">Last run:</span>
                      <span>{formatDate(action.last_run)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetScheduledActionsSuccess;