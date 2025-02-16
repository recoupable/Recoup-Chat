import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import Segments from "./Segments";
import SocialSharing from "../SocialSharing";
import getAggregatedSocialProfiles from "@/lib/agent/getAggregatedSocialProfiles";
import SegmentsSkeleton from "./SegmentsSkeleton";
import { Skeleton } from "../ui/skeleton";

const CompletedAnalysis = () => {
  const { segments, funnelName, isLoadingSegments, isLoadingAgent } =
    useFunnelAnalysisProvider();
  const { selectedArtist } = useArtistProvider();
  const isLoading = isLoadingSegments || isLoadingAgent;

  const FanSegmentLabel = () => (
    <p className="text-lg md:text-xl text-xl font-bold py-4"> Fan Segments</p>
  );
  return (
    <>
      <p className="text-lg md:text-xl font-bold pb-4">
        <span className="capitalize">{funnelName}</span> Analysis complete✅
      </p>
      {isLoading ? (
        <>
          <Skeleton className="w-full h-10" />
          <FanSegmentLabel />
          <Skeleton className="w-full h-10" />
          <SegmentsSkeleton />
        </>
      ) : (
        <>
          <p>{`${selectedArtist?.name} has ${getAggregatedSocialProfiles(selectedArtist)?.followerCount} followers. We've analyzed your most recent 100 engagements in this quick scan. Select a fan segmentation below to generate a detailed report for brand partnership opportunities.`}</p>
          <FanSegmentLabel />
          <p>{`We categorized ${selectedArtist?.name}'s fans into ${segments?.length || 0} different segments - click any to explore. The agent is running in the background and will notify you of new insights!`}</p>
          <Segments />
        </>
      )}
      <SocialSharing />
    </>
  );
};

export default CompletedAnalysis;
