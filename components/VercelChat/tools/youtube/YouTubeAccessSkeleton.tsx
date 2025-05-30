import React from "react";
import { Youtube } from "lucide-react";

export function YouTubeAccessSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-gray-400" />
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Channel Info Skeleton */}
      <div className="flex items-start space-x-3">
        {/* Avatar Skeleton */}
        <div className="h-12 w-12 rounded-full bg-gray-300 shrink-0"></div>

        {/* Channel Details Skeleton */}
        <div className="flex-grow min-w-0 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-200">
        <div className="text-center space-y-1">
          <div className="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
        </div>
        <div className="text-center space-y-1">
          <div className="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-10 mx-auto"></div>
        </div>
        <div className="text-center space-y-1">
          <div className="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-8 mx-auto"></div>
        </div>
      </div>

      {/* Date Skeleton */}
      <div className="h-3 bg-gray-300 rounded w-20"></div>
    </div>
  );
}

export default YouTubeAccessSkeleton; 