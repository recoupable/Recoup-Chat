import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Message = ({ message }: { message: AIMessage }) => {
  const [loading, setLoading] = useState(true);

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
      console.log("ZIAD HERE", data);
      setLoading(false);
    };

    const isAssistant = message.role === "assistant";
    const question =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.question
        : "";
    const context =
      message?.toolInvocations?.[0].state === "result"
        ? message.toolInvocations[0].result?.context
        : "";
    if (!question || !context || !isAssistant) {
      setLoading(false);
      return;
    }
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
        {loading ? "is thinking..." : ""}
      </div>
    </div>
  );
};

export default Message;
