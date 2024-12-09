import { useChatProvider } from "@/providers/ChatProvider";
import { FAN_TYPE } from "@/types/fans";
import { Message } from "ai";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import useToolChat from "./useToolChat";
import { useParams } from "next/navigation";
import getToolCallMessage from "@/lib/getToolCallMessage";
import useToolCallParams from "./useToolCallParams";
import getVideoComments from "@/lib/getVideoComments";
import isActiveToolCallTrigger from "@/lib/isActiveToolCallTrigger";
import getTikTokProfile from "@/lib/getTiktokProfile";
import { Tools } from "@/types/Tool";
import getReportNextSteps from "@/lib/getReportNextSteps";
import { ArtistRecord } from "@/types/Artist";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useTikTokReportProvider } from "@/providers/TikTokReportProvider";

const useToolCall = (message: Message) => {
  const { finalCallback } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const [isCalled, setIsCalled] = useState(false);
  const { toolName, context, question } = useToolCallParams(message);
  const fans = context?.fans?.filter((fan: FAN_TYPE) => fan.name !== "Unknown");
  const { setBeginCall, answer, loading } = useToolChat(question, toolName);
  const { setSelectedArtist, artists } = useArtistProvider();
  const {
    setIsSearchingTrends,
    setTiktokNextSteps,
    setTiktokTrends,
    setIsGettingAnalysis,
    setIsGettingVideos,
    setTiktokAnalysis,
    setTiktokVideos,
  } = useTikTokReportProvider();

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
      if (!isAssistant || isCalled) return;
      setIsCalled(true);
      if (isActiveToolCallTrigger(toolName, context?.status)) {
        if (toolName === Tools.getArtistAnalysis) {
          setIsSearchingTrends(true);
          const profile = await getTikTokProfile(context?.username);
          const videoComments = await getVideoComments(
            encodeURIComponent(JSON.stringify(profile?.videos)),
          );
          setTiktokTrends({
            ...profile,
            videos: videoComments.videos,
            total_video_comments_count:
              videoComments.total_video_comments_count,
          });
          setIsSearchingTrends(false);
        }
        if (toolName === Tools.getVideosInfo) {
          setIsGettingVideos(true);
          const videoUrls = encodeURIComponent(`["${context.videoUrl}"]`);
          const data = await getVideoComments(videoUrls);
          setTiktokVideos(data);
          setIsGettingVideos(false);
        }
        if (toolName === Tools.getSegmentsReport) {
          const activeArtist = artists.find(
            (artist: ArtistRecord) => artist.id === context?.analysis?.artistId,
          );
          if (activeArtist) {
            setSelectedArtist(activeArtist);
          }
          setIsGettingAnalysis(true);
          setTiktokAnalysis(context?.analysis);
          const nextSteps = await getReportNextSteps(context?.analysis);
          setTiktokNextSteps(nextSteps);
          setIsGettingAnalysis(false);
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
  };
};

export default useToolCall;
