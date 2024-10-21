import { useChatProvider } from "@/providers/ChatProvider";
import { useEffect } from "react";
import { ScrollArea } from "react-scroll-to";
import Thinking from "./Thinking";
import Message from "./Message";
import { Message as AIMessage } from "ai";

const Messages = ({
  scroll,
}: {
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const { messages, pending } = useChatProvider();

  useEffect(() => {
    scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, pending]);

  return (
    <ScrollArea
      className={`w-full mt-4 max-w-3xl mx-auto overflow-y-auto ${messages.length && "grow"}`}
    >
      {messages.map((message: AIMessage, index: number) => (
        <Message message={message} key={index} />
      ))}
      {pending && <Thinking />}
    </ScrollArea>
  );
};

export default Messages;
