import useGenerateSegmentReport from "@/hooks/useGenerateSegmentReport";
import { type Segment } from "@/lib/supabase/getArtistSegments";
import SegmentButton from "./SegmentButton";

interface SegmentsProps {
  segments: Segment[];
}

const Segments = ({ segments }: SegmentsProps) => {
  const { handleGenerateReport } = useGenerateSegmentReport();

  const sortedSegments = [...segments].sort((a, b) => b.size - a.size);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {sortedSegments.map((segment) => (
        <SegmentButton
          key={segment.id}
          segment={segment}
          onGenerateReport={handleGenerateReport}
        />
      ))}
    </div>
  );
};

export default Segments;
