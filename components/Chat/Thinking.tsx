import getThinkingStatus from "@/lib/getThinkingStatus";
import { LoaderCircle } from "lucide-react";
import Icon from "../Icon";
import { useMessagesProvider } from "@/providers/MessagesProvider";

const Thinking = () => {
  const { toolCall } = useMessagesProvider();
  return (
    <div className="p-3 flex gap-2 w-full max-w-3xl mx-auto items-center pb-2">
      <div className="p-2 border border-grey rounded-full">
        <Icon name="logo-xs" />
      </div>
      <p className="text-sm">{getThinkingStatus(toolCall)}</p>
      <LoaderCircle className="h-4 w-4 animate-spin" />
    </div>
  );
};

export default Thinking;
