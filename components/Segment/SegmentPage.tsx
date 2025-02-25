"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SegmentPageProps {
  segmentRoom: {
    id: string;
    room_id: string;
    segment_id: string;
    updated_at: string;
  } | null;
  isLoading?: boolean;
  error?: string;
}

const SegmentPage: FC<SegmentPageProps> = ({
  segmentRoom,
  isLoading,
  error,
}) => {
  if (error) {
    return (
      <div className="max-w-screen min-h-screen p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-screen min-h-screen p-4">
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </>
      ) : segmentRoom ? (
        <div>Segment room found: {segmentRoom.room_id}</div>
      ) : (
        <div>No segment room found - generating report...</div>
      )}
    </div>
  );
};

export default SegmentPage;
