import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledActionDetailsDialogHeaderProps {
  action: Tables<"scheduled_actions">;
  isActive?: boolean;
  isPaused?: boolean;
}

const ScheduledActionDetailsDialogHeader = ({
  action,
  isActive = false,
  isPaused = false,
}: ScheduledActionDetailsDialogHeaderProps) => {
  return (
    <DialogHeader className={cn("pb-2 shrink-0")}>
      <DialogTitle className="flex items-center gap-1.5 text-base text-left">
        {isActive && <Play className="h-4 w-4 text-green-500 flex-shrink-0" />}
        {isPaused && <Pause className="h-4 w-4 text-gray-500 flex-shrink-0" />}
        <span className={cn("truncate")}>{action.title}</span>
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
          {isActive ? "Active" : "Paused"}
        </span>
      </DialogTitle>
    </DialogHeader>
  );
};

export default ScheduledActionDetailsDialogHeader;
