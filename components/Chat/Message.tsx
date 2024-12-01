import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";
import Icon from "../Icon";
import { useChatProvider } from "@/providers/ChatProvider";
import ReportSummaryNote from "./ReportSummaryNote";

const Message = ({ message, index }: { message: AIMessage; index: number }) => {
  const { context, loading } = useToolCallProvider();
  const { reportEnabled, pending } = useChatProvider();

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
          <Icon name="logo-xs" />
        </div>
      )}
      <div className={`grow ${message.role === "user" && "flex justify-end"}`}>
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
        {reportEnabled && index === 0 && !pending && !loading && (
          <ReportSummaryNote />
        )}
      </div>
    </div>
  );
};

export default Message;
