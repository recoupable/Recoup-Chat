import React from "react";

/**
 * Component that displays when the create_new_artist tool is being called
 * Shows a loading skeleton for the artist being created
 */
export function CreateArtistToolCall() {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-md bg-gray-50 my-2">
      {/* Profile picture skeleton */}
      <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />

      <div className="space-y-2">
        {/* Name skeleton */}
        <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
        {/* Status text */}
        <div className="text-sm text-gray-500">Creating new artist...</div>
      </div>
    </div>
  );
}

export default CreateArtistToolCall;
