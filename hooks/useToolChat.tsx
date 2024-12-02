import getFullReport from "@/lib/getFullReport";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useChatProvider } from "@/providers/ChatProvider";
import { ArtistRecord } from "@/types/Artist";
import { Message, useChat } from "ai/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const useToolChat = (question?: string, toolName?: any) => {
  const { finalCallback, clearQuery } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [tiktokTrends, setTiktokTrends] = useState<any>(null);
  const [isSearchingTrends, setIsSearchingTrends] = useState(false);
  const [isGettingVideos, setIsGettingVideos] = useState(false);
  const [tiktokVideos, setTiktokVideos] = useState<any>({});
  const [tiktokAnalysis, setTiktokAnalysis] = useState<any>(null);
  const [tiktokNextSteps, setTikTokNextSteps] = useState("");
  const [tiktokReportContent, setTiktokReportContent] = useState("");
  const { setArtistActive, setSelectedArtist, artists } = useArtistProvider();

  const toolCallContext = {
    ...(tiktokTrends !== null && { ...tiktokTrends }),
    ...tiktokVideos,
    ...(tiktokAnalysis !== null && { ...tiktokAnalysis }),
  };

  const [beginCall, setBeginCall] = useState(false);

  const {
    messages,
    append,
    isLoading: loading,
  } = useChat({
    api: "/api/tool_call",
    body: {
      question,
      context: toolCallContext,
      toolName,
    },
    onError: console.error,
    onFinish: async (message) => {
      await finalCallback(
        message,
        {
          id: uuidV4(),
          content: question as string,
          role: "user",
        },
        conversationId as string,
      );
      await clearQuery();
    },
  });

  const answer = messages.filter(
    (message: Message) => message.role === "assistant",
  )?.[0]?.content;

  useEffect(() => {
    const init = async () => {
      await append({
        id: uuidV4(),
        content: question as string,
        role: "user",
      });
      const reportContent = await getFullReport(tiktokAnalysis);
      console.log("ZIAD", reportContent);
      setTiktokReportContent(reportContent);
      const activeArtist = artists.find(
        (artist: ArtistRecord) => artist.id === tiktokAnalysis?.artistId,
      );
      if (activeArtist) {
        setArtistActive(true);
        setSelectedArtist(activeArtist);
      }
      setTiktokAnalysis(null);
      setTiktokTrends(null);
      setTiktokVideos({});
      setBeginCall(false);
    };
    if (!beginCall || !question) return;
    init();
  }, [beginCall, question]);

  return {
    messages,
    append,
    loading: loading || isSearchingTrends,
    isSearchingTrends,
    setTiktokTrends,
    setIsSearchingTrends,
    answer,
    tiktokTrends,
    setBeginCall,
    setIsGettingVideos,
    isGettingVideos,
    setTiktokVideos,
    tiktokVideos,
    setTiktokAnalysis,
    setTikTokNextSteps,
    tiktokNextSteps,
    tiktokReportContent,
  };
};

export default useToolChat;
