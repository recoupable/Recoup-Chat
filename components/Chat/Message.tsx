import type { Message as AIMessage } from "@ai-sdk/react";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";

interface MessageProps {
  message: AIMessage;
  index: number;
}

const isAssistantMessage = (message: AIMessage): boolean =>
  message.role === "assistant";

const isUserMessage = (message: AIMessage): boolean => message.role === "user";

const Message = ({ message }: MessageProps) => {
  if (message.role === "system" || message.role === "data") {
    return null;
  }

  return (
    <div className="p-3 rounded-lg">
      {isAssistantMessage(message) ? (
        <AssistantMessage message={message} />
      ) : isUserMessage(message) ? (
        <UserMessage message={message} />
      ) : null}
    </div>
  );
};

export default Message;
