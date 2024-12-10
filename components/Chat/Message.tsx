import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";
import { useChatProvider } from "@/providers/ChatProvider";
import Icon from "../Icon";
import ReportSummaryNote from "./ReportSummaryNote";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";
import useTikTokReference from "@/hooks/useTikTokReference";
import Answer from "../Tools/Answer";

const Message = ({ message, index }: { message: AIMessage; index: number }) => {
  const { context, loading } = useToolCallProvider();
  const { tiktokNextSteps } = useTikTokReportProvider();
  const { reportEnabled, pending, messages } = useChatProvider();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { reportActive, summary } = useTikTokReference(message as any);
  const isLoading = pending || loading;

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
          <Icon name="logo-xs" />
        </div>
      )}
      <div
        className={`grow ${message.role === "user" && "flex justify-end"} max-w-[90%]`}
      >
        {context && <ToolContent />}
        {reportActive && index === 0 ? (
          <Answer content={summary} role="assistant" />
        ) : (
          <ToolFollowUp message={message} />
        )}
        {reportEnabled &&
          index === 0 &&
          (!isLoading || messages.length > 2) &&
          tiktokNextSteps && <ReportSummaryNote />}
      </div>
    </div>
  );
};

export default Message;
