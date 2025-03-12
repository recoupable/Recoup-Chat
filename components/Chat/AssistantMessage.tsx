import type { Message } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import Icon from "../Icon";
import MessageContent from "./MessageContent";
import { findJsonObjects } from "@/lib/chat/assistant/messageParser";
import { createMessageSegments } from "@/lib/chat/assistant/messageSegmentation";

interface AssistantMessageProps {
  message: Message;
  index: number;
}

// Keywords that suggest the AI is using context from previous messages
const CONTEXT_KEYWORDS = [
  "earlier",
  "previously",
  "you mentioned",
  "as you said",
  "as discussed",
  "as we talked about",
  "referring back to",
  "going back to",
];

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  const [isUsingContext, setIsUsingContext] = useState(false);
  
  // Check if the message content contains any context keywords
  useEffect(() => {
    if (message.content) {
      const content = message.content.toLowerCase();
      const usesContext = CONTEXT_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
      setIsUsingContext(usesContext);
    }
  }, [message.content]);

  const jsonObjects = findJsonObjects(message.content);
  const segments = createMessageSegments(message.content, jsonObjects);

  return (
    <div className="flex w-full gap-2">
      <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
        <Icon name="logo-xs" />
      </div>
      <div className="grow max-w-[90%]">
        {isUsingContext && (
          <div className="text-xs text-gray-500 italic mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Using context from previous messages
          </div>
        )}
        <MessageContent segments={segments} />
      </div>
    </div>
  );
};

export default AssistantMessage;
