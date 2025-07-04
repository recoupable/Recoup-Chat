import React from "react";
import { Youtube } from "lucide-react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useYouTubeLoginSuccess } from "@/hooks/useYouTubeLoginSuccess";
import { ConnectYouTubeButton } from "@/components/common/ConnectYouTubeButton";

export interface YouTubeErrorDisplayProps {
  errorMessage: string;
}

export function YouTubeErrorDisplay({
  errorMessage,
}: YouTubeErrorDisplayProps) {
  const { selectedArtist } = useArtistProvider();
  
  // Hook that automatically continues conversation after successful YouTube OAuth
  useYouTubeLoginSuccess();

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-800">
          YouTube Access Required
        </span>

        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
          Live
        </span>
      </div>

      {/* Artist Context */}
      <div className="text-xs text-gray-600">
        Artist: <span className="font-medium">{selectedArtist?.account_id}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600">{errorMessage}</p>

      {/* Login Button */}
      <ConnectYouTubeButton
        accountId={selectedArtist?.account_id}
        className="w-full"
        size="sm"
        disabled={!selectedArtist?.account_id}
      />

      <p className="text-xs text-gray-500 text-center">
        You&apos;ll be redirected to Google to authorize access to your YouTube
        channel for this artist.
      </p>
    </div>
  );
}
