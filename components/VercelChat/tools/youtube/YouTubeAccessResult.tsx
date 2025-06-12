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
import { YouTubeChannelInfoResult } from "@/types/youtube";
import { YouTubeChannelDisplay } from "./YouTubeChannelDisplay";
import { YouTubeErrorDisplay } from "./YouTubeErrorDisplay";

interface YouTubeAccessResultProps {
  result: YouTubeChannelInfoResult;
}

export function YouTubeAccessResult({ result }: YouTubeAccessResultProps) {
  console.log("YouTubeAccessResult result", result);

  // Success state - show channel information
  if (result.channelInfo) {
    return (
      <YouTubeChannelDisplay channel={result.channelInfo} isLive={!!status} />
    );
  }

  // Error state - show login button
  const errorMessage =
    normalizedResult.message ||
    "Please connect your YouTube account to access channel information.";

  return (
    <YouTubeErrorDisplay
      errorMessage={errorMessage}
      onLogin={() => {}} // {login}
      isLive={!!status}
    />
  );
}

export default YouTubeAccessResult;
