import React from "react";
import type { YouTubeSetThumbnailResult } from "@/types/youtube";

const YouTubeSetThumbnailResult = ({
  result,
}: {
  result: YouTubeSetThumbnailResult;
}) => {
  if (!result.success) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border-l-4 border-l-red-500 text-red-600 text-sm shadow-sm">
        {result.message || result.error || "Failed to set thumbnail"}
      </div>
    );
  }

  const thumbObj = result.thumbnails?.[0] ?? {};
  const thumb =
    thumbObj?.maxres?.url ||
    thumbObj?.high?.url ||
    thumbObj?.medium?.url ||
    thumbObj?.standard?.url ||
    thumbObj?.default?.url;

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 max-w-xs mr-auto">
      {thumb && (
        <div className="w-full aspect-video bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt="YouTube Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="font-medium text-sm">Thumbnail updated</div>
        </div>
        <div className="text-xs text-gray-500 pl-4">
          {result.message || "Successfully set new thumbnail."}
        </div>
      </div>
    </div>
  );
};

export default YouTubeSetThumbnailResult;
