import { useUserProvider } from "@/providers/UserProvder";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import getTwitterProfile from "@/lib/twitter/getTwitterProfile";
import getComments from "@/lib/twitter/getComments";
import getSegments from "@/lib/getSegments";
import { SETTING_MODE } from "@/types/Setting";
import useSaveFunnelArtist from "./useSaveFunnelArtist";
import { useArtistProvider } from "@/providers/ArtistProvider";
import saveFunnelAnalysis from "@/lib/saveFunnelAnalysis";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";
import getArtistFunnelHandle from "@/lib/getArtistFunnelHandle";
import getFunnelAnalysisByArtistId from "@/lib/getFunnelAnalysisByArtistId";
import { Funnel_Type } from "@/types/Funnel";

const useTwitterAnalysis = () => {
  const {
    setIsLoading,
    setThought,
    username,
    isLoading,
    setResult,
    artistHandle,
    setSegments,
    funnelName,
    funnelType,
  } = useFunnelAnalysisProvider();
  const { saveFunnelArtist } = useSaveFunnelArtist();
  const { setSettingMode, artists } = useArtistProvider();
  const { isPrepared } = useUserProvider();
  const { trackFunnelAnalysisChat } = useConversationsProvider();
  const { push } = useRouter();

  const handleAnalyze = async () => {
    try {
      if (!isPrepared()) return;
      setIsLoading(true);
      if (!username || isLoading) return;
      const newId = uuidV4();
      push(`/funnels/${funnelType}/${newId}`);
      const artistSelected = artists.find(
        (artist) =>
          artistHandle ===
          getArtistFunnelHandle(artist, Funnel_Type.TWITTER.toUpperCase()),
      );
      if (artistSelected) {
        const analysisCache = await getFunnelAnalysisByArtistId(
          artistSelected?.id || "",
        );
        await trackFunnelAnalysisChat(
          username,
          artistSelected?.id,
          analysisCache?.chat_id,
          funnelName,
        );
        if (analysisCache) {
          setResult(analysisCache);
          setSegments(analysisCache.segments);
          setThought(STEP_OF_ANALYSIS.FINISHED);
          return;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1900));
      setThought(STEP_OF_ANALYSIS.PROFILE);
      const profile = await getTwitterProfile(artistHandle);
      if (profile?.error) {
        setThought(STEP_OF_ANALYSIS.UNKNOWN_PROFILE);
        return;
      }
      const comments = await getComments(artistHandle);
      const profileWithComments = {
        ...profile,
        comments,
        total_comments_count: comments?.length,
      };
      let fanSegmentsWithIcons = [];
      if (comments.length > 0) {
        setThought(STEP_OF_ANALYSIS.SEGMENTS);
        fanSegmentsWithIcons = await getSegments(profileWithComments);
        if (fanSegmentsWithIcons?.error) {
          setThought(STEP_OF_ANALYSIS.ERROR);
          return;
        }
        setSegments([...fanSegmentsWithIcons]);
      }
      setResult(profileWithComments);
      setSettingMode(SETTING_MODE.CREATE);
      setThought(STEP_OF_ANALYSIS.CREATING_ARTIST);
      const artistId = await saveFunnelArtist(profileWithComments);
      setThought(STEP_OF_ANALYSIS.SAVING_ANALYSIS);
      const analysis = {
        ...profile,
        videos: comments,
        total_video_comments_count: comments?.length,
        segments: [...fanSegmentsWithIcons],
        chat_id: newId,
        artistId,
      };
      const newAnalaysisId = await saveFunnelAnalysis(analysis);
      setResult({
        id: newAnalaysisId,
        ...analysis,
      });
      await trackFunnelAnalysisChat(username, artistId, newId, funnelName);
      setThought(STEP_OF_ANALYSIS.FINISHED);
    } catch (error) {
      setThought(STEP_OF_ANALYSIS.ERROR);
    }
  };

  return {
    handleAnalyze,
  };
};

export default useTwitterAnalysis;
