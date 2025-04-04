import type { Message } from "@ai-sdk/react";
import ChatMarkdown from "./ChatMarkdown";

interface UserMessageProps {
  message: Message;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <ChatMarkdown>
      {decodeURIComponent(message.content.replaceAll("%", "&#37;") || "")}
    </ChatMarkdown>
  );
};

export default UserMessage;
