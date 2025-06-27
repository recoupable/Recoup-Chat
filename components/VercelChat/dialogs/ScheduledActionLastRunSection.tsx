import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";

interface ScheduledActionLastRunSectionProps {
  lastRun: string | null;
  isDeleted: boolean;
}

const ScheduledActionLastRunSection = ({
  lastRun,
  isDeleted,
}: ScheduledActionLastRunSectionProps) => {
  if (!lastRun) return null;
  
  return (
    <div className={cn("flex items-center gap-1.5 text-xs pt-2 mt-1", {
      "border-t border-gray-100": !isDeleted,
      "border-t border-red-100": isDeleted
    })}>
      <RotateCw className={cn("h-3.5 w-3.5 flex-shrink-0", {
        "text-green-600": !isDeleted,
        "text-red-600": isDeleted
      })} />
      <span className={cn("font-medium", {
        "text-gray-700": !isDeleted,
        "text-red-700": isDeleted
      })}>Last Run:</span>
      <span className={cn("break-words", {
        "text-gray-600": !isDeleted,
        "text-red-600": isDeleted
      })}>
        {formatScheduledActionDate(lastRun)}
      </span>
    </div>
  );
};

export default ScheduledActionLastRunSection; 