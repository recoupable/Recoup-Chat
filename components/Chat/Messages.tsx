import { useChatProvider } from "@/providers/ChatProvider";
import { useEffect } from "react";
import { ScrollArea } from "react-scroll-to";
import Thinking from "./Thinking";
import Message from "./Message";
import { Message as AIMessage } from "ai";
import { ToolCallProvider } from "@/providers/ToolCallProvider";

const Messages = ({
  scroll,
}: {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const { messages, pending, suggestions } = useChatProvider();
  const scrollTo = () => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, pending, suggestions]);

  return (
    <ScrollArea
      className={`w-full mt-4 max-w-3xl mx-auto overflow-y-auto ${messages.length && "grow"}`}
    >
      {messages.map((message: AIMessage, index: number) => (
        <ToolCallProvider message={message} scrollTo={scrollTo} key={index}>
          <Message message={message} />
        </ToolCallProvider>
      ))}
      {pending && <Thinking />}
    </ScrollArea>
  );
};

export default Messages;
