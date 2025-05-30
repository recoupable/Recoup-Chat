/**
 * YouTube Access Result Component
 * 
 * Displays YouTube channel information or authentication status.
 * Handles the unified YouTube tool response that includes both
 * authentication checking and channel data fetching.
 * 
 * DISPLAYS:
 * - Channel information if authenticated
 * - Authentication instructions if not authenticated
 * - Loading states during verification
 */

import React from "react";
import { Youtube, Loader } from "lucide-react";
import { 
  YouTubeAccessResult as YouTubeAccessResultType,
  YouTubeChannelInfoResult
} from "@/types/youtube";
import { useYouTubeAccess } from "@/hooks/useYouTubeAccess";
import { YouTubeChannelDisplay } from "./YouTubeChannelDisplay";
import { YouTubeErrorDisplay } from "./YouTubeErrorDisplay";

interface YouTubeAccessResultProps {
  result: YouTubeAccessResultType | YouTubeChannelInfoResult;
}

export function YouTubeAccessResult({ result }: YouTubeAccessResultProps) {
  // Convert YouTubeChannelInfoResult to YouTubeAccessResult format for compatibility
  const normalizedResult: YouTubeAccessResultType = 'channelInfo' in result && result.channelInfo && 'title' in result.channelInfo
    ? {
        // This is YouTubeChannelInfoResult format
        success: result.success,
        status: result.status,
        message: result.message,
        channelInfo: {
          id: result.channelInfo.id,
          name: result.channelInfo.title, // Map title to name
          thumbnails: {
            default: result.channelInfo.thumbnails.default?.url || null,
            medium: result.channelInfo.thumbnails.medium?.url || null,
            high: result.channelInfo.thumbnails.high?.url || null,
          },
          subscriberCount: result.channelInfo.statistics?.subscriberCount,
          videoCount: result.channelInfo.statistics?.videoCount,
          viewCount: result.channelInfo.statistics?.viewCount,
          customUrl: result.channelInfo.customUrl,
          country: result.channelInfo.country,
          publishedAt: result.channelInfo.publishedAt,
        }
      }
    : result as YouTubeAccessResultType; // This is already YouTubeAccessResult format

  const {
    selectedArtist,
    currentStatus,
    isCheckingStatus,
    isAuthenticated,
    displayResult,
    handleYouTubeLogin,
  } = useYouTubeAccess(normalizedResult);

  // Show loading state while checking current status
  if (isCheckingStatus) {
    return (
      <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
        <div className="flex items-center space-x-2">
          <Youtube className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-800">Checking YouTube Access...</span>
        </div>
        <div className="flex items-center space-x-2">
          <Loader className="h-4 w-4 animate-spin text-gray-600" />
          <span className="text-sm text-gray-600">Verifying authentication status</span>
        </div>
      </div>
    );
  }

  // Show error if no artist is selected
  if (!selectedArtist) {
    return (
      <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
        <div className="flex items-center space-x-2">
          <Youtube className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-800">Artist Required</span>
        </div>
        <p className="text-sm text-gray-600">Please select an artist to check YouTube access.</p>
      </div>
    );
  }

  // Success state - show channel information
  if (isAuthenticated && displayResult?.channel) {
    return (
      <YouTubeChannelDisplay
        channel={displayResult.channel}
        artistName={selectedArtist.name || "Unknown Artist"}
        isLive={!!currentStatus}
      />
    );
  }

  // Error state - show login button
  const errorMessage = currentStatus?.message || result.message || "Please connect your YouTube account to access channel information.";
  
  return (
    <YouTubeErrorDisplay
      artistName={selectedArtist.name || "Unknown Artist"}
      errorMessage={errorMessage}
      onLogin={handleYouTubeLogin}
      isLive={!!currentStatus}
    />
  );
}

export default YouTubeAccessResult; 