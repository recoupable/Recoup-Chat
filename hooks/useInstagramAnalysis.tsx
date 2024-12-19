import getVideoComments from "@/lib/tiktok/getVideoComments";
import uploadPfp from "@/lib/uploadPfp";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { SETTING_MODE } from "@/types/Setting";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import useSaveFunnelArtist from "./useSaveFunnelArtist";
import saveFunnelAnalysis from "@/lib/saveFunnelAnalysis";
import { v4 as uuidV4 } from "uuid";
import getSegments from "@/lib/getSegments";
import getArtistFunnelHandle from "@/lib/getArtistFunnelHandle";
import getFunnelAnalysisByArtistId from "@/lib/getFunnelAnalysisByArtistId";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { useRouter } from "next/navigation";
import { Funnel_Type } from "@/types/Funnel";
import getInstagramProfile from "@/lib/instagram/getInstagramProfile";
import getReelsComments from "@/lib/instagram/getReelsComments";

const useInstagramAnalysis = () => {
  const { setSettingMode, artists } = useArtistProvider();
  const {
    setIsLoading,
    setThought,
    username,
    isLoading,
    setResult,
    setProgress,
    setSegments,
    artistHandle,
    funnelName,
    funnelType,
  } = useFunnelAnalysisProvider();
  const { saveFunnelArtist } = useSaveFunnelArtist();
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
          getArtistFunnelHandle(artist, Funnel_Type.INSTAGRAM.toUpperCase()),
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
      const profile = await getInstagramProfile(artistHandle, setThought);
      if (profile?.error) {
        setThought(STEP_OF_ANALYSIS.UNKNOWN_PROFILE);
        return;
      }
      const reelsComments = await getReelsComments(
        artistHandle,
        setThought,
        setProgress,
      );
      const profileWithComments = {
        ...profile,
        videos: reelsComments,
        total_video_comments_count: reelsComments.length,
      };
      setResult(profileWithComments);
      let fanSegmentsWithIcons = [];
      if (reelsComments.length > 0) {
        setThought(STEP_OF_ANALYSIS.SEGMENTS);
        fanSegmentsWithIcons = await getSegments(profileWithComments);
        if (fanSegmentsWithIcons?.error) {
          setThought(STEP_OF_ANALYSIS.ERROR);
          return;
        }
        setSegments([...fanSegmentsWithIcons]);
      }
      setSettingMode(SETTING_MODE.CREATE);
      setThought(STEP_OF_ANALYSIS.CREATING_ARTIST);
      const artistId = await saveFunnelArtist(
        profile?.nickname,
        profile?.avatar,
        `https://instagram.com/${artistHandle}`,
      );
      setThought(STEP_OF_ANALYSIS.SAVING_ANALYSIS);
      const analysis = {
        ...profileWithComments,
        segments: [...fanSegmentsWithIcons],
        chat_id: newId,
        artistId,
      };
      const newAnalaysisId = await saveFunnelAnalysis(analysis);
      setResult({
        id: newAnalaysisId,
        ...profileWithComments,
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

export default useInstagramAnalysis;
