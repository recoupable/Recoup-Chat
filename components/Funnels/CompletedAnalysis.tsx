import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import Segments from "./Segments";
import SocialSharing from "../SocialSharing";

const CompletedAnalysis = () => {
  const { result, segments, funnelName } = useFunnelAnalysisProvider();
  const { selectedArtist } = useArtistProvider();
  return (
    <>
      <p className="text-lg md:text-xl font-bold pb-4">
        <span className="capitalize">{funnelName}</span> Analysis complete✅
      </p>
      <p>{`${result?.nickname || selectedArtist?.name} has ${result?.followers} followers. Please select a fan segmentation below to generate a report for brand partnership deals.`}</p>
      <p className="text-lg md:text-xl text-xl font-bold py-4"> Fan Segments</p>
      <p>{`We categorized ${result?.name}'s fans into ${Object.keys(segments).length} different segments - click any to explore. The agent is running in the background and will notify you of new insights!`}</p>
      {segments?.length > 0 && <Segments />}
      <SocialSharing />
    </>
  );
};

export default CompletedAnalysis;
