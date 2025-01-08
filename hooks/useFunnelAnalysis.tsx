import { useArtistProvider } from "@/providers/ArtistProvider";
import { useInitialChatProvider } from "@/providers/InitialChatProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useParams } from "next/navigation";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useCallback, useEffect } from "react";
import getFunnelAnalysis from "@/lib/getFunnelAnalysis";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import useFunnelAnalysisParams from "./useFunnelAnalysisParams";
import getAggregatedArtist from "@/lib/agent/getAggregatedArtist";
import getAggregatedSocials from "@/lib/agent/getAggregatedSocials";

const useFunnelAnalysis = () => {
  const params = useFunnelAnalysisParams();
  const { setSelectedArtist, selectedArtist } = useArtistProvider();
  const { chat_id: chatId } = useParams();
  const { clearMessagesCache } = useInitialChatProvider();
  const { clearReportCache, setBannerArtistName, setBannerImage } =
    useFunnelReportProvider();
  const { fetchConversations } = useConversationsProvider();
  const { address } = useUserProvider();

  const getAnalysis = useCallback(async () => {
    if (!chatId) return;
    clearReportCache();
    clearMessagesCache();
    const funnel_analyses: any = await getFunnelAnalysis(chatId as string);
    if (!funnel_analyses) return;
    const artist: any = getAggregatedArtist(funnel_analyses);
    if (params.funnelType === "wrapped") {
      setSelectedArtist({
        ...artist,
        ...selectedArtist,
        artist_social_links: getAggregatedSocials([
          ...artist?.artist_social_links,
          ...(selectedArtist?.artist_social_links || []),
        ]),
        isWrapped: true,
      });
    } else setSelectedArtist(artist);

    setBannerImage(artist.image);
    setBannerArtistName(artist.name);
    const analytics_segments: any = [];
    const tempThoughts: any = {};
    funnel_analyses.map((funnel_analysis: any) => {
      if (funnel_analysis.status === STEP_OF_ANALYSIS.FINISHED) {
        analytics_segments.push(funnel_analysis.funnel_analytics_segments);
      }
      tempThoughts[`${funnel_analysis.type.toLowerCase()}`] = {
        status: funnel_analysis.status,
      };
      params.setThoughts(tempThoughts);
    });
    params.setUsername(artist.handle || "");
    params.setSegments(analytics_segments.flat());
    params.setResult({
      segments: analytics_segments.flat(),
      ...artist.profile,
      handle: artist.handle,
    });
    params.setIsLoading(true);
    fetchConversations(address);
  }, [chatId]);

  useEffect(() => {
    getAnalysis();
  }, [getAnalysis]);

  return {
    getAnalysis,
    ...params,
  };
};

export default useFunnelAnalysis;
