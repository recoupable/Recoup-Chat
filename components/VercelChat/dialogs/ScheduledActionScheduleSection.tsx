import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";
import { parseCronToHuman } from "@/lib/utils/cronUtils";

interface ScheduledActionScheduleSectionProps {
  schedule: string;
  nextRun: string;
}

const ScheduledActionScheduleSection = ({
  schedule,
  nextRun,
}: ScheduledActionScheduleSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div className={cn("flex flex-col gap-1 p-2 rounded-lg bg-gray-50")}>
        <div
          className={cn("flex items-center gap-1.5 font-medium text-gray-700")}
        >
          <CalendarDays
            className={cn("h-3.5 w-3.5 flex-shrink-0 text-indigo-600")}
          />
          Schedule
        </div>
        <div className={cn("break-words text-gray-600")}>
          <span className="font-mono">{schedule}</span>
          <div className={cn("text-[10px] mt-0.5 text-gray-500")}>
            {parseCronToHuman(schedule)}
          </div>
        </div>
      </div>

      <div className={cn("flex flex-col gap-1 p-2 rounded-lg bg-gray-50")}>
        <div
          className={cn("flex items-center gap-1.5 font-medium text-gray-700")}
        >
          <Clock className={cn("h-3.5 w-3.5 flex-shrink-0 text-orange-600")} />
          Next Run
        </div>
        <div className={cn("break-words text-gray-600")}>
          {formatScheduledActionDate(nextRun)}
        </div>
      </div>
    </div>
  );
};

export default ScheduledActionScheduleSection;
