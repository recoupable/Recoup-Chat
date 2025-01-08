import getThoughtStatus from "@/lib/getThoughtStatus";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import StreamingThought from "./StreamThought";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Thought = ({ funnel, thought }: { funnel: string; thought: any }) => {
  const { artistHandle, funnelType, funnelName, isFinished } =
    useFunnelAnalysisProvider();
  const { selectedArtist, toggleSettingModal } = useArtistProvider();

  const socialLink = selectedArtist?.artist_social_links?.find(
    (social) => social.type === funnel.toUpperCase() && social.link,
  );
  const isError = thought.status === STEP_OF_ANALYSIS.ERROR;
  const isComplete =
    thought.status === STEP_OF_ANALYSIS.FINISHED || (socialLink && isError);
  const handle = funnelType === "wrapped" ? selectedArtist?.name : artistHandle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusMessages: any = {
    [STEP_OF_ANALYSIS.PROFILE]: `Looking at ${handle}'s profile.`,
    [STEP_OF_ANALYSIS.TRACKS]: `Looking at ${handle}'s tracks.`,
    [STEP_OF_ANALYSIS.ALBUMS]: `Looking at ${handle}'s albums.`,
    [STEP_OF_ANALYSIS.POSTURLS]: `Reviewing ${handle}'s top-performing videos.`,
    [STEP_OF_ANALYSIS.VIDEO_COMMENTS]: getThoughtStatus(thought.progress),
    [STEP_OF_ANALYSIS.SEGMENTS]: `Grouping all of the @${handle}'s ${funnelName} Fans into the segments.`,
    [STEP_OF_ANALYSIS.SAVING_ANALYSIS]: `Saving video comments scrapped data.`,
    [STEP_OF_ANALYSIS.CREATING_ARTIST]: `Setting up artist mode.`,
  };

  return (
    <>
      <span>
        {funnelType === "wrapped" && !isFinished && `${funnel.toUpperCase()}: `}
      </span>
      <StreamingThought text={statusMessages[thought.status] || ""} />
      {isError && !isFinished && !socialLink && (
        <span onClick={toggleSettingModal} className="underline cursor-pointer">
          Click here to retry.
        </span>
      )}
      {isComplete && !isFinished && (
        <StreamingThought
          text={`${funnel} analysis complete ✅`}
        ></StreamingThought>
      )}
    </>
  );
};

export default Thought;
