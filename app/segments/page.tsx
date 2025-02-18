"use client";

import { type NextPage } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import BaseSegments from "@/components/Segments/BaseSegments";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistSegments } from "@/hooks/useArtistSegments";

const SegmentsWrapper = () => {
  const { selectedArtist } = useArtistProvider();

  const {
    data: segments,
    isLoading,
    error,
  } = useArtistSegments(selectedArtist?.account_id);

  if (!selectedArtist || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load segments
      </div>
    );
  }

  if (!segments?.length) {
    return (
      <div className="text-center py-4">No segments found for this artist.</div>
    );
  }

  return <BaseSegments segments={segments} />;
};

const SegmentsPage: NextPage = () => {
  return (
    <div className="max-w-screen min-h-screen px-4">
      <SegmentsWrapper />
    </div>
  );
};

export default SegmentsPage;
