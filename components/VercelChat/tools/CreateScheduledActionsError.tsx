import React from "react";
import { AlertCircle } from "lucide-react";

interface CreateScheduledActionsErrorProps {
  message?: string;
  error: string;
}

const CreateScheduledActionsError: React.FC<CreateScheduledActionsErrorProps> = ({
  message,
  error,
}) => {
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
};

export default CreateScheduledActionsError;