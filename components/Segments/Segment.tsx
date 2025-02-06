import { Star } from "lucide-react";

interface SegmentProps {
  name: string;
  size: number;
  icon?: string;
  onClick?: () => void;
}

const Segment = ({ name, size, onClick }: SegmentProps) => {
  return (
    <button
      className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex items-center gap-2 shadow-grey"
      type="button"
      onClick={onClick}
    >
      <Star className="flex-shrink-0 w-4 h-4" />
      <p className="font-bold text-xs truncate">
        {name} {size}
      </p>
    </button>
  );
};

export default Segment;
