"use client";

import { type NextPage } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import BaseSegments from "@/components/Segments/BaseSegments";
import { useArtistProvider } from "@/providers/ArtistProvider";

const SegmentsWrapper = () => {
  const { selectedArtist } = useArtistProvider();

  const segments = [
    { name: "Super Fans", size: 15, icon: "star" },
    { name: "Active Engagers", size: 25, icon: "star" },
    { name: "Regular Listeners", size: 20, icon: "star" },
    { name: "Concert Goers", size: 10, icon: "star" },
    { name: "Playlist Curators", size: 5, icon: "star" },
    { name: "Social Sharers", size: 8, icon: "star" },
    { name: "New Followers", size: 7, icon: "star" },
    { name: "Merchandise Buyers", size: 4, icon: "star" },
    { name: "Content Creators", size: 3, icon: "star" },
    { name: "Industry Professionals", size: 2, icon: "star" },
    { name: "International Fans", size: 1, icon: "star" },
  ];

  if (!selectedArtist) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    );
  }

  return <BaseSegments segments={segments} />;
};

const SegmentsPage: NextPage = () => {
  return (
    <main className="max-h-[555px] p-4">
      <SegmentsWrapper />
    </main>
  );
};

export default SegmentsPage;
