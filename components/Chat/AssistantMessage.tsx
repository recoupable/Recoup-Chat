import type { Message } from "@ai-sdk/react";
import Icon from "../Icon";
import MessageContent from "./MessageContent";
import { findJsonObjects } from "@/lib/chat/assistant/messageParser";
import { createMessageSegments } from "@/lib/chat/assistant/messageSegmentation";

interface AssistantMessageProps {
  message: Message;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  const jsonObjects = findJsonObjects(message.content);
  const segments = createMessageSegments(message.content, jsonObjects);

  return (
    <div className="flex w-full gap-2">
      <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
        <Icon name="logo-xs" />
      </div>
      <div className="grow max-w-[90%]">
        <MessageContent segments={segments} />
      </div>
    </div>
  );
};

export default AssistantMessage;
