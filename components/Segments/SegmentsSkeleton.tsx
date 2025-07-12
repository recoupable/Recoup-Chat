import { Skeleton } from "../ui/skeleton";

const SegmentsSkeleton = () => {
  return (
    <div className="w-full mt-8 grid grid-cols-2 gap-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className="h-8 w-full" key={index} />
      ))}
    </div>
  );
};

export default SegmentsSkeleton;
