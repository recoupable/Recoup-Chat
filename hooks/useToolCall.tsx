import { useChatProvider } from "@/providers/ChatProvider";
import { FAN_TYPE } from "@/types/fans";
import { Message } from "ai";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import useToolChat from "./useToolChat";
import { useParams } from "next/navigation";
import { ArtistToolResponse } from "@/types/Tool";
import getToolCallMessage from "@/lib/getToolCallMessage";
import useToolCallParams from "./useToolCallParams";

const useToolCall = (message: Message) => {
  const { finalCallback } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [isCalled, setIsCalled] = useState(false);
  const { toolName, context, question } = useToolCallParams(message);
  const fans = context?.fans?.filter((fan: FAN_TYPE) => fan.name !== "Unknown");
  const {
    setBeginCall,
    setTiktokTrends,
    setIsSearchingTrends,
    answer,
    loading,
    tiktokTrends,
    isSearchingTrends,
  } = useToolChat(question, context, toolName);

  useEffect(() => {
    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newToolCallMessage: any = getToolCallMessage(toolName, context);
      if (newToolCallMessage) {
        finalCallback(
          newToolCallMessage,
          { id: uuidV4(), content: question, role: "user" },
          conversationId as string,
        );
        return;
      }

      const isAssistant = message.role === "assistant";
      if (!isAssistant) return;
      if (isCalled) return;
      setIsCalled(true);
      if (
        toolName === "getCampaign" ||
        (toolName === "getArtistAnalysis" &&
          context.status === ArtistToolResponse.TIKTOK_TRENDS)
      ) {
        if (toolName === "getArtistAnalysis") {
          setIsSearchingTrends(true);
          const response = await fetch(
            `/api/trends?handle=${context?.username}`,
          );
          const data = await response.json();
          setTiktokTrends(data.trends);
          setIsSearchingTrends(false);
        }
        setBeginCall(true);
      }
    };
    if (!context || !question) return;
    init();
  }, [question, context, toolName]);

  return {
    loading,
    answer,
    toolName,
    question,
    context,
    fans,
    tiktokTrends,
    isSearchingTrends,
  };
};

export default useToolCall;
