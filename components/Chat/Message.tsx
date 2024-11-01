import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";

const Message = ({ message }: { message: AIMessage }) => {
  const { context } = useToolCallProvider();
  const Icon = message.role === "user" ? UserIcon : TvMinimalPlay;

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      <div className="size-fit">
        <Icon className="h-6 w-6" />
      </div>
      <div className="grow">
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
      </div>
    </div>
  );
};

export default Message;
