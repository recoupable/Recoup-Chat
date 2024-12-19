import { useUserProvider } from "@/providers/UserProvder";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import getSegments from "@/lib/getSegments";
import { SETTING_MODE } from "@/types/Setting";
import useSaveFunnelArtist from "./useSaveFunnelArtist";
import { useArtistProvider } from "@/providers/ArtistProvider";
import saveFunnelAnalysis from "@/lib/saveFunnelAnalysis";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";
import getArtistProfile from "@/lib/spotify/getArtistProfile";
import getArtistAlbums from "@/lib/spotify/getArtistAlbums";
import getArtistTracks from "@/lib/spotify/getArtistTracks";

const useSpotifyAnalysis = () => {
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
  const { setSettingMode } = useArtistProvider();
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
      await new Promise((resolve) => setTimeout(resolve, 1900));
      setThought(STEP_OF_ANALYSIS.PROFILE);
      const data = await getArtistProfile(artistHandle);
      if (data?.error) {
        setThought(STEP_OF_ANALYSIS.UNKNOWN_PROFILE);
        return;
      }
      const profile = data.profile;
      const artistUri = data.artistId;
      setThought(STEP_OF_ANALYSIS.ALBUMS);
      const albums = await getArtistAlbums(artistUri);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setThought(STEP_OF_ANALYSIS.TRACKS);
      const tracks = await getArtistTracks(artistUri);
      const profileWithTracks = {
        ...profile,
        albums,
        tracks,
      };
      let fanSegmentsWithIcons = [];
      if (tracks.length > 0) {
        setThought(STEP_OF_ANALYSIS.SEGMENTS);
        fanSegmentsWithIcons = await getSegments(profileWithTracks);
        if (fanSegmentsWithIcons?.error) {
          setThought(STEP_OF_ANALYSIS.ERROR);
          return;
        }
        setSegments([...fanSegmentsWithIcons]);
      }
      setResult(profileWithTracks);
      setSettingMode(SETTING_MODE.CREATE);
      setThought(STEP_OF_ANALYSIS.CREATING_ARTIST);
      const artistId = await saveFunnelArtist(
        profile?.name,
        profile?.avatar,
        `https://open.spotify.com/artist/${artistUri}`,
      );
      setThought(STEP_OF_ANALYSIS.SAVING_ANALYSIS);
      const analysis = {
        ...profile,
        videos: [...albums, ...tracks],
        total_video_comments_count: tracks.length,
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

export default useSpotifyAnalysis;
