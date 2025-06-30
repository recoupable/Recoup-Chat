import React from "react";
import { Trash2, CheckCircle } from "lucide-react";
import { DeleteScheduledActionsResult } from "@/lib/tools/scheduled_actions/deleteScheduledActions";
import ScheduledActionCard from "./ScheduledActionCard";

export interface DeleteScheduledActionsSuccessProps {
  result: DeleteScheduledActionsResult;
}

const DeleteScheduledActionsSuccess: React.FC<DeleteScheduledActionsSuccessProps> = ({
  result,
}) => {
  const { actions, message, error } = result;

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl">
        <div className="flex items-start space-x-3">
          <Trash2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Failed to Delete Scheduled Actions
            </h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
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
    <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm max-w-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-red-100 bg-red-100/50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-sm font-semibold text-red-800">Deleted Scheduled Actions</h3>
        </div>
        <p className="text-xs text-red-700 mt-1">{message}</p>
      </div>

      {/* Deleted Actions List */}
      <div className="p-4">
        {actions.length === 0 ? (
          <div className="text-center py-6">
            <Trash2 className="h-8 w-8 text-red-300 mx-auto mb-2" />
            <p className="text-sm text-red-600">No actions were deleted</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {actions.map((action) => (
              <ScheduledActionCard key={action.id} action={action} isDeleted={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteScheduledActionsSuccess; 