import { Message as AIMessage } from "ai";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ToolFollowUp = ({ message }: { message: AIMessage }) => {
  const { loading, answer, toolName, context } = useToolCallProvider();
  const content = message.content || answer;

  useEffect(() => {
    scrollTo();
    const timeoutId = setTimeout(scrollTo, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, context]);

  return (
    <div>
      {toolName === "getCampaign" && (
        <>
          {loading && !content ? (
            <div className="flex gap-2 items-center">
              <p>is thinking...</p>
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="text-sm font-sans text-pretty break-words">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ToolFollowUp;
