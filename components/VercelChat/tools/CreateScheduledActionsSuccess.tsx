import React from "react";
import { CreateScheduledActionsResult } from "@/lib/tools/scheduled_actions/createScheduledActions";
import GenericSuccess from "./GenericSuccess";
import { formatCronSchedule, formatActionsCount, getActionStatus, truncatePrompt } from "@/lib/utils/scheduledActionsUtils";
import { Calendar, CheckCircle } from "lucide-react";

interface CreateScheduledActionsSuccessProps {
  result: CreateScheduledActionsResult;
}

const CreateScheduledActionsSuccess: React.FC<CreateScheduledActionsSuccessProps> = ({
  result,
}) => {
  const { actions, message, error } = result;

  // If there's an error, show error state
  if (error) {
    return (
      <GenericSuccess
        name="Scheduled Actions"
        message={message || "Failed to create scheduled actions"}
      >
        <div className="text-xs text-red-500 mt-1">
          Error: {error}
        </div>
      </GenericSuccess>
    );
  }

  // Success state
  return (
    <GenericSuccess
      name="Scheduled Actions"
      message={message || `Created ${formatActionsCount(actions.length)}`}
    >
      <div className="mt-2 space-y-2">
        {actions.map((action, index) => (
          <div 
            key={action.id || index} 
            className="bg-white rounded-lg border border-gray-100 p-2 text-xs"
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-gray-800 truncate flex-1 mr-2">
                {action.title}
              </h4>
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                action.enabled !== false 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getActionStatus(action)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <Calendar className="h-3 w-3" />
              <span>{formatCronSchedule(action.schedule)}</span>
            </div>
            
            {action.prompt && (
              <div className="flex items-start gap-1 text-gray-500">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="leading-tight">
                  {truncatePrompt(action.prompt, 80)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </GenericSuccess>
  );
};

export default CreateScheduledActionsSuccess;