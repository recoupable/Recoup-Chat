import React from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { YouTubeErrorDisplayProps } from "@/types/youtube";

export function YouTubeErrorDisplay({
  name,
  errorMessage,
  onLogin,
  isLive,
}: YouTubeErrorDisplayProps) {
  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-800">
          YouTube Access Required
        </span>
        {isLive && (
          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Live
          </span>
        )}
      </div>

      {/* Artist Context */}
      <div className="text-xs text-gray-600">
        Artist: <span className="font-medium">{name}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600">{errorMessage}</p>

      {/* Login Button */}
      <Button
        onClick={onLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        <Youtube className="h-4 w-4 mr-2" />
        Connect YouTube Account
      </Button>

      <p className="text-xs text-gray-500 text-center">
        You&apos;ll be redirected to Google to authorize access to your YouTube
        channel for this artist.
      </p>
    </div>
  );
}
