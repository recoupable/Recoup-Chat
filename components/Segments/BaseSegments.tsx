import Segment from "./Segment";

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
        <Segment
          key={segment.name}
          name={segment.name}
          size={segment.size}
          icon={segment.icon}
          onClick={() => onSegmentClick?.(segment.name)}
        />
      ))}
    </div>
  );
};

export default BaseSegments;
