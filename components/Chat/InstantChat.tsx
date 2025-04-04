"use client";

import { useEffect, useRef } from "react";
import { ScrollTo } from "react-scroll-to";
import Messages from "./Messages";
import InstantChatInput from "@/components/Chat/InstantChatInput";
import { useInstantChat } from "@/providers/InstantChatProvider";
import EmptyState from "./EmptyState";

// No need for InstantChatProvider here as it's now in the layout
const InstantChat = () => {
  const { messages, pending } = useInstantChat();
  const scrollRef = useRef<(options: { smooth: boolean; y: number }) => void>();

  // Use effect for scrolling outside the callback
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current({ smooth: true, y: Number.MAX_SAFE_INTEGER });
    }
  }, [messages, pending]);

  return (
    <div className="flex flex-col h-full">
      <ScrollTo>
        {({ scroll }) => {
          // Store the scroll function in the ref
          scrollRef.current = scroll;

          return (
            <div className="flex-1 min-h-0">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                // Render Messages component when we have messages
                <Messages
                  messages={messages}
                  pending={pending}
                  scroll={scroll}
                />
              )}
            </div>
          );
        }}
      </ScrollTo>
      <InstantChatInput />
    </div>
  );
};

export default InstantChat;
