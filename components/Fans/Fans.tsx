import { type Social } from "@/hooks/useArtistFans";
import FanAvatar from "./FanAvatar";
import FansList from "./FansList";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface FansProps {
  fansWithAvatars: Social[];
  fansWithoutAvatars: Social[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const Fans = ({
  fansWithAvatars,
  fansWithoutAvatars,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: FansProps) => {
  // Set up the intersection observer for infinite scrolling
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    // Only start observing if we have more pages and aren't already fetching
    skip: !hasNextPage || isFetchingNextPage,
  });

  // Fetch more fans when the load more element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-8">
      {/* Fans with avatars section */}
      {fansWithAvatars.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Fans with Profile Pictures</h2>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
            {fansWithAvatars.map((fan) => (
              <FanAvatar key={fan.id} fan={fan} />
            ))}
          </div>
        </div>
      )}

      {/* Fans without avatars section */}
      {fansWithoutAvatars.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Fans without Profile Pictures
          </h2>
          <FansList fans={fansWithoutAvatars} />
        </div>
      )}

      {/* Load more trigger element */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="animate-pulse text-gray-500">
              Loading more fans...
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
    </div>
  );
};

export default Fans;
