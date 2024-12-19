import Segments from "./Segments";
import { useEffect } from "react";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";

const Completion = () => {
  const { result, segments, handleRetry, artistHandle, funnelName } =
    useFunnelAnalysisProvider();
  const { getPrompts } = usePromptsProvider();

  useEffect(() => {
    if (result) getPrompts(JSON.stringify(result), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const isFinishedAnalsysis =
    result?.videos?.length ||
    result?.comments?.length ||
    result?.tracks?.length;

  return (
    <div>
      {isFinishedAnalsysis ? (
        <>
          <p className="text-xl font-bold pb-4">
            <span className="capitalize">{funnelName}</span> Analysis complete✅
          </p>
          {`${result?.nickname} has ${result?.fans} followers. \nPlease select a fan segmentation below to generate a report for brand partnership deals.`}
          <p className="text-xl font-bold py-4"> Fan Segments</p>
          {`We categorized ${result?.name}'s fans into ${Object.keys(segments).length} different segments - click any to explore. The agent is running in the background and will notify you of new insights!`}
          {segments?.length > 0 && <Segments />}
        </>
      ) : (
        <>
          {`The account @${artistHandle || result?.name} does not have any engagement. Please try again with a TikTok handle with at least one comment on its videos. `}
          <span onClick={handleRetry} className="underline cursor-pointer">
            Click here to retry.
          </span>
        </>
      )}
    </div>
  );
};

export default Completion;
