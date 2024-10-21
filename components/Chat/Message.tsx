import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Message = ({ message }: { message: AIMessage }) => {
  useEffect(() => {
    const init = async () => {
      const response = await fetch(`/api/tool_call`, {
        method: "POST",
        body: JSON.stringify({
          context,
          question,
        }),
      });
      const data = await response.json();
      console.log("ZIAD", data);
    };

    const question =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.question
        : "";
    const context =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.context
        : "";
    if (!question) return;
    init();
  }, [message]);

  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
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
  );
};

export default Message;
