import React from "react";
import { ListTodo, CheckCircle2 } from "lucide-react";
import { GetScheduledActionsResult } from "@/lib/tools/scheduled_actions/getScheduledActions";
import ScheduledActionCard from "./ScheduledActionCard";
import ScheduledActionDetailsDialog from "../dialogs/ScheduledActionDetailsDialog";

export interface GetScheduledActionsSuccessProps {
  result: GetScheduledActionsResult;
}

const GetScheduledActionsSuccess: React.FC<GetScheduledActionsSuccessProps> = ({
  result,
}) => {
  const { actions, message } = result;

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
              <ScheduledActionDetailsDialog key={action.id} action={action}>
                <ScheduledActionCard action={action} />
              </ScheduledActionDetailsDialog>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default GetScheduledActionsSuccess;