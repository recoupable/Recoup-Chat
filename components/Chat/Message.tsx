import useToolCall from "@/hooks/useToolCall";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Thinking from "./Thinking";

const Message = ({ message }: { message: AIMessage }) => {
  const { loading } = useToolCall(message);
  const { pending } = useChatProvider();

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {!(pending && message.role === "assistant") && (
        <>
          <div className="size-fit">
            {message.role === "user" ? (
              <UserIcon className="h-6 w-6" />
            ) : (
              <TvMinimalPlay className="h-6 w-6" />
            )}
          </div>
          <div className="text-sm font-sans text-pretty break-words">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {loading ? <Thinking /> : ""}
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
