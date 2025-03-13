"use client";

import { Terminal } from "lucide-react";
import CurrentState from "./CurrentState";
import { useArtistProvider } from "@/providers/ArtistProvider";
import Events from "./Events";
import Approvals from "./Approvals";
import { useUserProvider } from "@/providers/UserProvder";
import { Skeleton } from "@/components/ui/skeleton";
import useLoginRedirect from "@/hooks/useLoginRedirect";

const AutoPilot = () => {
  const { selectedArtist } = useArtistProvider();
  const { email } = useUserProvider();
  useLoginRedirect();
  const showSkeleton = !selectedArtist || !email;

  return (
    <div className="grow font-mono p-3 md:p-4 rounded-lg flex flex-col">
      <div className="flex items-center gap-2 mb-2 md:mb-4 pb-2 md:pb-4">
        <Terminal className="h-5 w-5" />
        <h1 className="text-md md:text-lg font-plus_jakarta_sans_bold">
          {showSkeleton ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            `${selectedArtist?.name}'s Agent`
          )}
        </h1>
      </div>
      {showSkeleton ? (
        <div className="flex flex-col md:block md:grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full grow">
          <div className="space-y-1 md:space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="flex flex-col md:block md:grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full grow">
          <div className="space-y-1 md:space-y-4">
            <CurrentState />
            <Events />
          </div>
          <Approvals />
        </div>
      )}
    </div>
  );
};

export default AutoPilot;
