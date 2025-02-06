import { Star } from "lucide-react";

interface Segment {
  name: string;
  size: number;
  icon?: string;
}

interface BaseSegmentsProps {
  segments: Segment[];
  onSegmentClick?: (segmentName: string) => void;
}

const BaseSegments = ({ segments, onSegmentClick }: BaseSegmentsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {segments.map((segment) => (
        <button
          className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex gap-2 items-center shadow-grey"
          type="button"
          key={segment.name}
          onClick={() => onSegmentClick?.(segment.name)}
        >
          <Star className="w-4 h-4" />
          <p className="font-bold text-xs text-center">
            {segment.name} {segment.size}
          </p>
        </button>
      ))}
    </div>
  );
};

export default BaseSegments;
