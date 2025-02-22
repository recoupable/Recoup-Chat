import { MessageProps } from "@/types/ChatMessage";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";

const Message = ({ message }: MessageProps) => {
  if (message.role === "system" || message.role === "data") {
    return null;
  }

  return (
    <div className="p-3 rounded-lg">
      {message.role === "assistant" ? (
        <AssistantMessage message={message} />
      ) : (
        <UserMessage message={message} />
      )}
    </div>
  );
};

export default Message;
