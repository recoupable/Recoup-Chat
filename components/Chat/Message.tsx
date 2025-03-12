import type { Message as AIMessage } from "@ai-sdk/react";
import AssistantMessage from "./AssistantMessage";
import SimpleUserMessage from "./SimpleUserMessage";

interface MessageProps {
  message: AIMessage;
  index: number;
}

const isAssistantMessage = (message: AIMessage): boolean =>
  message.role === "assistant";

const isUserMessage = (message: AIMessage): boolean => message.role === "user";

const Message = ({ message, index }: MessageProps) => {
  if (message.role === "system" || message.role === "data") {
    return null;
  }

  return (
    <div className="p-3 rounded-lg">
      {isAssistantMessage(message) ? (
        <AssistantMessage message={message} index={index} />
      ) : isUserMessage(message) ? (
        <SimpleUserMessage message={message} />
      ) : null}
    </div>
  );
};

export default Message;
