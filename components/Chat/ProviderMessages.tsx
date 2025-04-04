"use client";

import { useEffect } from "react";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import Messages from "./Messages";

const ProviderMessages = ({
  scroll,
  className,
  children,
}: {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { messages, pending } = useMessagesProvider();
  const { prompts } = usePromptsProvider();
  const scrollTo = () => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, pending, prompts]);

  return (
    <Messages
      messages={messages}
      pending={pending}
      scroll={scroll}
      className={className}
    >
      {children}
    </Messages>
  );
};

export default ProviderMessages;
