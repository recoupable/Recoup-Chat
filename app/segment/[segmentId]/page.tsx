"use client";

import { type NextPage } from "next";
import { Skeleton } from "@/components/ui/skeleton";

interface SegmentPageProps {
  params: {
    segmentId: string;
  };
}

const SegmentPage: NextPage<SegmentPageProps> = ({ params }) => {
  console.log("SEGMENT ID", params.segmentId);
  return (
    <div className="max-w-screen min-h-screen p-4">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
};

export default SegmentPage;
