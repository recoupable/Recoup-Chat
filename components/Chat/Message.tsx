import { Message as AIMessage } from "ai";
import ToolContent from "../Tools/ToolContent";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import ToolFollowUp from "../Tools/ToolFollowUp";
import Image from "next/image";

const Message = ({ message }: { message: AIMessage }) => {
  const { context } = useToolCallProvider();
  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="w-6 h-6 relative">
          <Image src={"/logo-light.png"} layout="fill" alt="not found logo" />
        </div>
      )}
      <div className={`grow ${message.role === "user" && "flex justify-end"}`}>
        {context && <ToolContent />}
        <ToolFollowUp message={message} />
      </div>
    </div>
  );
};

export default Message;
