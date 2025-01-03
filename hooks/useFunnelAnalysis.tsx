import capitalize from "@/lib/capitalize";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useInitialChatProvider } from "@/providers/InitialChatProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useParams, useRouter } from "next/navigation";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { Funnel_Type } from "@/types/Funnel";
import getFunnelAnalysis from "@/lib/getFunnelAnalysis";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";

const useFunnelAnalysis = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thought, setThought] = useState(STEP_OF_ANALYSIS.INITITAL);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<Array<any>>([]);
  const artistHandle = username.replaceAll("@", "");
  const { funnel_type: funnelType } = useParams();
  const { push } = useRouter();
  const { setSelectedArtist } = useArtistProvider();
  const { chat_id: chatId } = useParams();
  const { clearMessagesCache } = useInitialChatProvider();
  const { clearReportCache, setBannerArtistName, setBannerImage } =
    useFunnelReportProvider();
  const { fetchConversations } = useConversationsProvider();
  const { address } = useUserProvider();

  const funnelName = useMemo(() => {
    if (!funnelType) return "";
    if (funnelType === Funnel_Type.TIKTOK) return "TikTok";
    return capitalize(funnelType as string);
  }, [funnelType]);

  const getAnalysis = useCallback(async () => {
    if (!chatId) return;
    clearReportCache();
    clearMessagesCache();
    const funnel_analysis: any = await getFunnelAnalysis(chatId as string);
    if (funnel_analysis) {
      if (funnel_analysis.status === STEP_OF_ANALYSIS.FINISHED) {
        setBannerImage(funnel_analysis.funnel_analytics_profile?.[0]?.avatar);
        setBannerArtistName(
          funnel_analysis.funnel_analytics_profile?.[0]?.nickname,
        );
        setSegments(funnel_analysis.funnel_analytics_segments);
        setResult({
          segments: funnel_analysis.funnel_analytics_segments,
          ...funnel_analysis.funnel_analytics_profile?.[0],
          id: funnel_analysis.id,
          handle: funnel_analysis.handle,
        });
        setSelectedArtist(
          funnel_analysis.funnel_analytics_profile?.[0]?.artists,
        );
        fetchConversations(address);
      }
      setUsername(funnel_analysis.handle || "");
      setThought(funnel_analysis.status);
      setIsLoading(true);
      return;
    }
  }, [chatId]);

  useEffect(() => {
    getAnalysis();
  }, [getAnalysis]);

  const handleRetry = () => {
    setResult(null);
    setSegments([]);
    setThought(STEP_OF_ANALYSIS.POSTURLS);
    setProgress(0);
    setUsername("");
    setIsLoading(false);
    push(`/funnels/${funnelType}/${uuidV4()}`);
  };

  const initialize = () => {
    setIsLoading(false);
    setThought(STEP_OF_ANALYSIS.INITITAL);
    push(`/funnels/${funnelType}/${uuidV4()}`);
  };

  return {
    username,
    setUsername,
    isLoading,
    setIsLoading,
    thought,
    result,
    setResult,
    progress,
    setProgress,
    segments,
    setThought,
    setSegments,
    artistHandle,
    funnelType,
    handleRetry,
    initialize,
    funnelName,
    getAnalysis,
  };
};

export default useFunnelAnalysis;
