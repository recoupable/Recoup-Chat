import Segments from "./Segments";
import SegmentsSkeleton from "./SegmentsSkeleton";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistSegments } from "@/hooks/useArtistSegments";

const SegmentsWrapper = () => {
  const { selectedArtist } = useArtistProvider();
  const {
    data: segments,
    isLoading,
    error,
  } = useArtistSegments(selectedArtist?.account_id);

  if (!selectedArtist || isLoading) {
    return <SegmentsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-lg text-center text-red-500 py-8">
        Failed to load segments
      </div>
    );
  }

  if (!segments?.length) {
    return (
      <div className="text-lg text-center py-8">
        No segments found for this artist.
      </div>
    );
  }

  return <Segments segments={segments} />;
};

export default SegmentsWrapper;
