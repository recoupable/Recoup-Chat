import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import ScheduledActionDetailsDialogHeader from "./ScheduledActionDetailsDialogHeader";
import ScheduledActionPromptSection from "./ScheduledActionPromptSection";
import ScheduledActionLastRunSection from "./ScheduledActionLastRunSection";
import ScheduledActionScheduleSection from "./ScheduledActionScheduleSection";

interface ScheduledActionDetailsDialogProps {
  children: React.ReactNode;
  action: Tables<"scheduled_actions">;
}

const ScheduledActionDetailsDialog: React.FC<
  ScheduledActionDetailsDialogProps
> = ({ children, action }) => {
  const isActive = Boolean(action.enabled);
  const isPaused = Boolean(!action.enabled);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-xs md:max-w-md p-6 max-h-[90vh] overflow-hidden flex flex-col pt-10"
        )}
      >
        <ScheduledActionDetailsDialogHeader
          action={action}
          isActive={isActive}
          isPaused={isPaused}
        />

        <div className={cn("flex flex-col gap-3 mt-1 overflow-y-auto")}>
          {/* Prompt Section */}
          <ScheduledActionPromptSection prompt={action.prompt} />

          {/* Schedule Information */}
          <ScheduledActionScheduleSection
            schedule={action.schedule}
            nextRun={action.next_run || ""}
          />

          {/* Last Run Information */}
          <ScheduledActionLastRunSection lastRun={action.last_run} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledActionDetailsDialog;
