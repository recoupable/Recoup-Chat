import { Message as AIMessage } from "ai";
import { useToolCallProvider } from "@/providers/ToolCallProvider";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import Answer from "./Answer";
import { useChatProvider } from "@/providers/ChatProvider";

const ToolFollowUp = ({ message }: { message: AIMessage }) => {
  const { toolCall } = useChatProvider();
  const { loading, answer, toolName, context, isSearchingTrends } =
    useToolCallProvider();
  const content = message.content || answer;

  useEffect(() => {
    scrollTo();
    const timeoutId = setTimeout(scrollTo, 1000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, context]);

  return (
    <div>
      {(toolName === "getCampaign" || toolName === "getArtistAnalysis") && (
        <>
          {loading && !content ? (
            <div className="flex gap-2 items-center">
              <p>
                {isSearchingTrends
                  ? `Searching for @${toolCall?.args?.user_name || ""} videos on tiktok...`
                  : "is thinking..."}
              </p>
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Answer content={content} />
          )}
        </>
      )}
      {!toolName && <Answer content={content} />}
    </div>
  );
};

export default ToolFollowUp;
