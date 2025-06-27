import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { Play, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledActionDetailsDialogHeaderProps {
  action: Tables<"scheduled_actions">;
  isActive?: boolean;
  isPaused?: boolean;
  isDeleted?: boolean;
}

const ScheduledActionDetailsDialogHeader = ({
  action,
  isActive = false,
  isPaused = false,
  isDeleted = false,
}: ScheduledActionDetailsDialogHeaderProps) => {
  return (
    <DialogHeader className={cn("pb-2 shrink-0", {
      "border-b border-red-100 mb-2": isDeleted
    })}>
      <DialogTitle className="flex items-center gap-1.5 text-base text-left">
        {isActive && (
          <Play className="h-4 w-4 text-green-500 flex-shrink-0" />
        )}
        {isPaused && (
          <Pause className="h-4 w-4 text-gray-500 flex-shrink-0" />
        )}
        {isDeleted && (
          <Trash2 className="h-4 w-4 text-red-500 flex-shrink-0" />
        )}
        <span className={cn("truncate", {
          "text-red-800": isDeleted
        })}>
          {action.title}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0",
            isActive
              ? "bg-green-100 text-green-800"
              : isPaused
                ? "bg-gray-100 text-gray-600"
                : "bg-red-200 text-red-800"
          )}
        >
          {isActive ? "Active" : isPaused ? "Paused" : "Deleted"}
        </span>
      </DialogTitle>
    </DialogHeader>
  );
};

export default ScheduledActionDetailsDialogHeader; 