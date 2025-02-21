import useGenerateSegmentReport from "@/hooks/useGenerateSegmentReport";
import { type Segment } from "@/lib/supabase/getArtistSegments";

interface SegmentsProps {
  segments: Segment[];
}

const Segments = ({ segments }: SegmentsProps) => {
  const { handleGenerateReport } = useGenerateSegmentReport();

  const sortedSegments = [...segments].sort((a, b) => b.size - a.size);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {sortedSegments.map((segment) => (
        <button
          key={segment.id}
          onClick={() => handleGenerateReport(segment.id, segment.name)}
          className="bg-black rounded-[10px] pl-5 pr-4 h-16 z-20 flex items-center gap-2 justify-between
            transition-all text-[15px] font-medium text-white hover:bg-black active:bg-white/80"
        >
          <div className="flex flex-col items-start">
            <p className="text-sm text-start">{segment.name}</p>
            <p className="text-xs text-grey-primary">{segment.size} fans</p>
          </div>
          <div className="text-xs text-grey-primary whitespace-nowrap">
            Generate Report
          </div>
        </button>
      ))}
    </div>
  );
};

export default Segments;
