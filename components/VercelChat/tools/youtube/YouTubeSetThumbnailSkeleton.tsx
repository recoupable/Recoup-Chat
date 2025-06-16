import React from "react";

const YouTubeSetThumbnailSkeleton = () => (
  <div className="flex flex-col items-center rounded-xl border border-gray-100 p-4 max-w-xs mr-auto">
    <div className="w-full aspect-video mb-3 overflow-hidden rounded-lg bg-gray-200 animate-pulse" />
    <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse mr-auto"  />
    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mr-auto" />
  </div>
);

export default YouTubeSetThumbnailSkeleton; 