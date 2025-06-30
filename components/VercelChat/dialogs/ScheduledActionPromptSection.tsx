import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledActionPromptSectionProps {
  prompt: string;
}

const ScheduledActionPromptSection = ({
  prompt,
}: ScheduledActionPromptSectionProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium text-gray-700"
        )}
      >
        <FileText className={cn("h-3.5 w-3.5 flex-shrink-0 text-blue-600")} />
        Prompt
      </div>
      <div
        className={cn(
          "text-xs p-2 rounded-lg max-h-[150px] overflow-y-auto bg-gray-50 border border-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{prompt}</p>
      </div>
    </div>
  );
};

export default ScheduledActionPromptSection;
