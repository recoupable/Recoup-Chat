import { useArtistProvider } from "@/providers/ArtistProvider";
import { STEP_OF_ANALYSIS } from "@/types/Funnel";
import { useCallback, useEffect, useState } from "react";

const useRunningAgents = () => {
  const [curLiveAgent, setCurLiveAgent] = useState<string | null>(null);
  const { selectedArtist } = useArtistProvider();

  const statusMessages: any = (handle: string) => ({
    [STEP_OF_ANALYSIS.INITITAL]: `Looking at ${handle}'s profile.`,
    [STEP_OF_ANALYSIS.PROFILE]: `Looking at ${handle}'s profile.`,
    [STEP_OF_ANALYSIS.TRACKS]: `Looking at ${handle}'s tracks.`,
    [STEP_OF_ANALYSIS.ALBUMS]: `Looking at ${handle}'s albums.`,
    [STEP_OF_ANALYSIS.POSTURLS]: `Reviewing ${handle}'s top-performing videos.`,
    [STEP_OF_ANALYSIS.VIDEO_COMMENTS]: `Looking at overlays and captions.`,
    [STEP_OF_ANALYSIS.SEGMENTS]: `Grouping all of the @${handle}'s Fans into the segments.`,
    [STEP_OF_ANALYSIS.SAVING_ANALYSIS]: `Saving video comments scrapped data.`,
    [STEP_OF_ANALYSIS.CREATING_ARTIST]: `Setting up artist mode.`,
  });

  const getLiveAgent = useCallback(async () => {
    if (!selectedArtist?.artist_id) return;
    const response = await fetch(
      `/api/get_running_agents?artistId=${selectedArtist?.artist_id || ""}`,
    );

    const data = await response.json();
    if (data?.data?.length === 0) {
      setCurLiveAgent(null);
      return;
    }
    setCurLiveAgent(
      null,
      // `Running ${data?.data?.[0]?.type?.toLowerCase()} Analysis... \n ${statusMessages(selectedArtist?.name)[`${data.data[0].status}`]}`,
    );
  }, [selectedArtist]);

  useEffect(() => {
    const timer = setInterval(getLiveAgent, 2000);
    return () => clearInterval(timer);
  }, [getLiveAgent]);

  return {
    curLiveAgent,
  };
};

export default useRunningAgents;
