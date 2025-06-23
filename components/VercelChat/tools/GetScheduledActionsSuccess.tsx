import React from "react";
import GenericSuccess from "./GenericSuccess";
import { Calendar, Clock, Play, Pause } from "lucide-react";
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

  return (
    <GenericSuccess
      name="Scheduled Actions"
      message={message}
    >
      {actions.length > 0 && (
        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
          {actions.map((action) => (
            <div
              key={action.id}
              className="bg-white rounded-lg border border-gray-100 p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {action.prompt}
                  </p>
                </div>
                <div className="flex items-center ml-2">
                  {action.enabled ? (
                    <Play className="h-3 w-3 text-green-500" />
                  ) : (
                    <Pause className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{action.schedule}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(action.next_run)}</span>
                </div>
              </div>
              
              {action.last_run && (
                <div className="text-xs text-gray-400">
                  Last run: {formatDate(action.last_run)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </GenericSuccess>
  );
};

export default GetScheduledActionsSuccess;