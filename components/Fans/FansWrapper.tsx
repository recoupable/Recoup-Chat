import { useArtistProvider } from "@/providers/ArtistProvider";
import {
  useArtistFans,
  type Social,
  type FansResponse,
} from "@/hooks/useArtistFans";
import Fans from "./Fans";
import FansSkeleton from "./FansSkeleton";
import { useCallback } from "react";
import { type InfiniteData } from "@tanstack/react-query";

const FANS_PER_PAGE = 20;

const FansWrapper = () => {
  const { selectedArtist } = useArtistProvider();
  const { data, isLoading, error, isFetchingNextPage } = useArtistFans(
    selectedArtist?.account_id,
    FANS_PER_PAGE
  );

  const processAllFans = useCallback(() => {
    if (!data) return { fansWithAvatars: [], fansWithoutAvatars: [] };

    const fansWithAvatars: Social[] = [];
    const fansWithoutAvatars: Social[] = [];

    const infiniteData = data as unknown as InfiniteData<FansResponse>;
    infiniteData.pages.forEach((page) => {
      if (!page.fans || !Array.isArray(page.fans)) return;

      page.fans.forEach((fan) => {
        if (!fan || typeof fan !== "object") return;

        const safeFan: Social = {
          id: fan.id || `fan-${Math.random().toString(36).substring(2, 9)}`,
          username: fan.username || "Anonymous",
          avatar: fan.avatar || null,
          profile_url: fan.profile_url || "#",
          region: fan.region || "",
          bio: fan.bio || "",
          followerCount:
            typeof fan.followerCount === "number" ? fan.followerCount : 0,
          followingCount:
            typeof fan.followingCount === "number" ? fan.followingCount : 0,
          updated_at: fan.updated_at || new Date().toISOString(),
        };

        if (safeFan.avatar) {
          fansWithAvatars.push(safeFan);
        } else {
          fansWithoutAvatars.push(safeFan);
        }
      });
    });

    const sortedFansWithAvatars = [...fansWithAvatars].sort(
      (a, b) => b.followerCount - a.followerCount
    );
    const sortedFansWithoutAvatars = [...fansWithoutAvatars].sort(
      (a, b) => b.followerCount - a.followerCount
    );

    return {
      fansWithAvatars: sortedFansWithAvatars,
      fansWithoutAvatars: sortedFansWithoutAvatars,
    };
  }, [data]);

  const { fansWithAvatars, fansWithoutAvatars } = processAllFans();

  if (!selectedArtist || isLoading) {
    return <FansSkeleton />;
  }

  if (error) {
    return (
      <div className="text-lg text-center text-red-500 py-8">
        Failed to load fans: {error.message}
      </div>
    );
  }

  if (!fansWithAvatars.length && !fansWithoutAvatars.length) {
    return (
      <div className="text-lg text-center py-8">
        No fans found for this artist.
      </div>
    );
  }

  return (
    <Fans
      fansWithAvatars={fansWithAvatars}
      fansWithoutAvatars={fansWithoutAvatars}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export default FansWrapper;
