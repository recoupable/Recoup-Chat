import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";

const Message = ({ message }: { message: AIMessage }) => {
  const { context } = useToolCallProvider();
  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={"/logo-light.png"}
          alt="not found logo"
          className="!w-6 !h-6"
        />
      )}
      <div className={`grow ${message.role === "user" && "flex justify-end"}`}>
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
      </div>
    </div>
  );
};

export default Message;
