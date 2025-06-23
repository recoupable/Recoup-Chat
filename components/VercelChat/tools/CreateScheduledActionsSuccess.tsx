import React from "react";
import { CreateScheduledActionsResult } from "@/lib/tools/scheduled_actions/createScheduledActions";
import ScheduledActionCard from "./ScheduledActionCard";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";

interface CreateScheduledActionsSuccessProps {
  result: CreateScheduledActionsResult;
}

const CreateScheduledActionsSuccess: React.FC<CreateScheduledActionsSuccessProps> = ({
  result,
}) => {
  const { actions, message, error } = result;

  // Format actions count for display
  const formatActionsCount = (count: number): string => {
    if (count === 0) return "No actions";
    if (count === 1) return "1 action";
    return `${count} actions`;
  };

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Failed to Create Scheduled Actions
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {message || "An error occurred while creating scheduled actions"}
            </p>
            <div className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-2xl">
      {/* Success Header */}
      <div className="flex items-start space-x-3 mb-4">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatActionsCount(actions.length)} created successfully</span>
          </h3>
        </div>
      </div>

      {/* Actions List */}
      {actions.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium text-green-800 uppercase tracking-wide">
            Created Actions ({actions.length})
          </div>
          <div className="space-y-2">
            {actions.map((action, index) => (
              <ScheduledActionCard 
                key={action.id || index} 
                action={action}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state (shouldn't happen in success, but just in case) */}
      {actions.length === 0 && (
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-600">
            No scheduled actions to display
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateScheduledActionsSuccess;