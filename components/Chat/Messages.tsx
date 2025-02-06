import { useEffect } from "react";
import { ScrollArea } from "react-scroll-to";
import Thinking from "./Thinking";
import Message from "./Message";
import { Message as AIMessage } from "ai";
import { ToolCallProvider } from "@/providers/ToolCallProvider";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import { usePromptsProvider } from "@/providers/PromptsProvider";

const Messages = ({
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
    <ScrollArea
      className={`w-full mt-4 max-w-3xl mx-auto overflow-y-auto grow ${className}`}
    >
      {children || <div />}
      {messages.map((message: AIMessage, index: number) => (
        <ToolCallProvider
          message={message}
          scrollTo={scrollTo}
          key={message.id}
        >
          <Message message={message} index={index} />
        </ToolCallProvider>
      ))}
      {pending && <Thinking />}
    </ScrollArea>
  );
};

export default Messages;
