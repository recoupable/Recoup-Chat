import { Skeleton } from "../ui/skeleton";

const ChatSkeleton = () => (
  <div className="size-full py-10">
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <Skeleton className="w-1/4 h-14 self-end" />
      <Skeleton className="w-1/2 h-20 self-start" />
      <Skeleton className="w-3/4 h-14 self-end" />
      <Skeleton className="w-3/4 h-24 self-start" />
    </div>
  </div>
);

export default ChatSkeleton;
