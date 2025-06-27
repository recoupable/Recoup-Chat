import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import ScheduledActionDetailsDialogHeader from "./ScheduledActionDetailsDialogHeader";
import ScheduledActionPromptSection from "./ScheduledActionPromptSection";
import ScheduledActionLastRunSection from "./ScheduledActionLastRunSection";
import ScheduledActionScheduleSection from "./ScheduledActionScheduleSection";

interface ScheduledActionDetailsDialogProps {
  children: React.ReactNode;
  action: Tables<"scheduled_actions">;
  isDeleted?: boolean;
}

const ScheduledActionDetailsDialog: React.FC<ScheduledActionDetailsDialogProps> = ({
  children,
  action,
  isDeleted = false,
}) => {
  // Ensure all boolean values are actually booleans
  const isDeletedBoolean = Boolean(isDeleted);
  const isActive = Boolean(action.enabled && !isDeletedBoolean);
  const isPaused = Boolean(!action.enabled && !isDeletedBoolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-md p-6 max-h-[90vh] overflow-hidden flex flex-col",
          {
            "bg-red-50 border-red-200": isDeletedBoolean,
          }
        )}
      >
        <ScheduledActionDetailsDialogHeader 
          action={action}
          isActive={isActive}
          isPaused={isPaused}
          isDeleted={isDeletedBoolean}
        />

        <div
          className={cn(
            "flex flex-col gap-3 mt-1 overflow-y-auto",
            isDeletedBoolean ? "opacity-80" : ""
          )}
        >
          {/* Prompt Section */}
          <ScheduledActionPromptSection 
            prompt={action.prompt}
            isDeleted={isDeletedBoolean}
          />

          {/* Schedule Information */}
          <ScheduledActionScheduleSection 
            schedule={action.schedule}
            nextRun={action.next_run || ''}
            isDeleted={isDeletedBoolean}
          />

          {/* Last Run Information */}
          <ScheduledActionLastRunSection 
            lastRun={action.last_run}
            isDeleted={isDeletedBoolean}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledActionDetailsDialog;
