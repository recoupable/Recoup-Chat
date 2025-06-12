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
import { YouTubeErrorDisplay } from "./YouTubeErrorDisplay";
import { YouTubeLoginResultType } from "@/lib/tools/youtubeLogin";
import GenericSuccess from "@/components/VercelChat/tools/GenericSuccess";

interface YouTubeLoginResultProps {
  result: YouTubeLoginResultType;
}

export function YouTubeLoginResult({ result }: YouTubeLoginResultProps) {
  // Success state - show generic success
  if (result.authentication) {
    return (
      <GenericSuccess
        name="YouTube Login Successful"
        message={
          result.authentication.access_token
            ? `Access Token: ${result.authentication.access_token.slice(0, 8)}...`
            : "YouTube account connected."
        }
      >
        {result.authentication.refresh_token && (
          <div className="text-xs text-gray-500 mt-1">
            Refresh Token: {result.authentication.refresh_token.slice(0, 8)}...
          </div>
        )}
      </GenericSuccess>
    );
  }

  // Error state - show login button
  const errorMessage =
    result.message ||
    "Please connect your YouTube account to access channel information.";

  return <YouTubeErrorDisplay errorMessage={errorMessage} />;
}

export default YouTubeLoginResult;
