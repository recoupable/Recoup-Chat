import { Skeleton } from "../ui/skeleton";

const ReportSkeleton = () => {
  return (
    <div className="w-full flex flex-col bg-white gap-2">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-8 w-2/4" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

export default ReportSkeleton;
