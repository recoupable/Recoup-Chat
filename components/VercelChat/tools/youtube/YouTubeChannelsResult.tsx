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

interface YouTubeChannelResultProps {
  result: YouTubeChannelInfoResult;
}

export function YouTubeChannelsResult({ result }: YouTubeChannelResultProps) {
  // Success state - show channel information
  if (result.channelInfo) {
    return (
      <div>
        {result.channelInfo.channels.map((channel) => (
          <YouTubeChannelDisplay
            key={channel.id}
            channel={channel}
            isLive={!!status}
          />
        ))}
      </div>
    );
  }

  // Error state - show login button
  const errorMessage =
    result.message ||
    "Please connect your YouTube account to access channel information.";

  return <YouTubeErrorDisplay errorMessage={errorMessage} />;
}

export default YouTubeChannelsResult;
