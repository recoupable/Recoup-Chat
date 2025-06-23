import React from "react";
import { CreateScheduledActionsResult } from "@/lib/tools/scheduled_actions/createScheduledActions";
import GenericSuccess from "./GenericSuccess";
import ScheduledActionCard from "./ScheduledActionCard";

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

  // Format actions count for display
  const formatActionsCount = (count: number): string => {
    if (count === 0) return "No actions";
    if (count === 1) return "1 action";
    return `${count} actions`;
  };

  // Success state
  return (
    <GenericSuccess
      name="Scheduled Actions"
      message={message || `Created ${formatActionsCount(actions.length)}`}
    >
      <div className="mt-2 space-y-2 max-w-md">
        {actions.map((action, index) => (
          <ScheduledActionCard 
            key={action.id || index} 
            action={action}
          />
        ))}
      </div>
    </GenericSuccess>
  );
};

export default CreateScheduledActionsSuccess;