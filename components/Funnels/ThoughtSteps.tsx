import getThoughtStatus from "@/lib/getThoughtStatus";
import { STEP_OF_ANALYSIS } from "@/types/TikTok";
import StreamingThought from "./StreamThought";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";

const ThoughtSteps = () => {
  const { thought, progress, username, artistHandle, funnelName } =
    useFunnelAnalysisProvider();

  return (
    <div className="font-bold">
      {thought === STEP_OF_ANALYSIS.PROFILE && (
        <StreamingThought text={`Looking at ${artistHandle}’s profile.`} />
      )}
      {thought === STEP_OF_ANALYSIS.TRACKS && (
        <StreamingThought text={`Looking at ${artistHandle}’s tracks.`} />
      )}
      {thought === STEP_OF_ANALYSIS.ALBUMS && (
        <StreamingThought text={`Looking at ${artistHandle}’s albums.`} />
      )}
      {thought === STEP_OF_ANALYSIS.POSTURLS && (
        <StreamingThought
          text={`Reviewing ${artistHandle}’s top-performing videos.`}
        />
      )}
      {thought === STEP_OF_ANALYSIS.VIDEO_COMMENTS && (
        <StreamingThought text={getThoughtStatus(progress)} />
      )}
      {thought === STEP_OF_ANALYSIS.SEGMENTS && (
        <StreamingThought
          text={`Grouping all of the @${username}'s ${funnelName} Fans into the segments.`}
        />
      )}
      {thought === STEP_OF_ANALYSIS.SAVING_ANALYSIS && (
        <StreamingThought text={`Saving video comments scrapped data.`} />
      )}
      {thought === STEP_OF_ANALYSIS.CREATING_ARTIST && (
        <StreamingThought text={`Setting up artist mode.`} />
      )}
    </div>
  );
};

export default ThoughtSteps;
