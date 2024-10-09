import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "react-scroll-to";
import Thinking from "./Thinking";

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
      {messages.map((message: Message, index: number) => (
        <div key={index} className="p-3 rounded-lg flex w-full gap-2">
          <div className="size-fit">
            {message.role === "user" ? (
              <UserIcon className="h-6 w-6" />
            ) : (
              <TvMinimalPlay className="h-6 w-6" />
            )}
          </div>
          <div className="text-sm font-sans text-pretty break-words">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      ))}
      {pending && <Thinking />}
    </ScrollArea>
  );
};

export default Messages;
