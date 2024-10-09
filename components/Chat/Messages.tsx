import { useChatProvider } from "@/providers/ChatProvider";
import { Message } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Messages = () => {
  const { messages } = useChatProvider();

  return (
    <div className="w-full mt-4 max-w-3xl mx-auto">
      <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default Messages;
