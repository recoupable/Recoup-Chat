import React from "react";

const YouTubeChannelVideosListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden border border-gray-100"
        >
          {/* Thumbnail Skeleton */}
          <div className="relative aspect-video bg-gray-200 animate-pulse" />

          {/* Video Info Skeleton */}
          <div className="p-2 sm:p-3">
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />

            {/* Metadata Skeleton */}
            <div className="flex items-center gap-2 mt-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YouTubeChannelVideosListSkeleton; 