"use client";

import { useState, useEffect } from "react";
import { validateYouTubeTokens } from "@/lib/youtube/token-validator";
import { fetchYouTubeChannelInfo } from "@/lib/youtube/channel-fetcher";
import { YouTubeChannelData } from "@/types/youtube";

interface UseYouTubeAuthResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  channelData: YouTubeChannelData | null;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to manage YouTube authentication state and channel data
 * Uses the same logic as getYouTubeChannels tool: validateYouTubeTokens + fetchYouTubeChannelInfo
 * @param artistAccountId - The artist account ID to check authentication for
 * @param userAccountId - The user account ID for authorization (not used with this approach)
 * @returns Object with authentication state, channel data, and loading state
 */
export function useYouTubeAuth(
  artistAccountId?: string,
  userAccountId?: string
): UseYouTubeAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelData, setChannelData] = useState<YouTubeChannelData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthStateAndChannelData = async () => {
    if (!artistAccountId) {
      setIsAuthenticated(false);
      setChannelData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the same logic as getYouTubeChannels tool
      const tokenValidation = await validateYouTubeTokens(artistAccountId);
      
      if (!tokenValidation.success) {
        setIsAuthenticated(false);
        setChannelData(null);
        setError("YouTube authentication required for this account");
        return;
      }

      const accessToken = tokenValidation.tokens!.access_token;
      const refreshToken = tokenValidation.tokens!.refresh_token;

      const channelResult = await fetchYouTubeChannelInfo({
        accessToken: accessToken,
        refreshToken: refreshToken || "",
        includeBranding: false,
      });

      if (channelResult.success && channelResult.channelData.length > 0) {
        setIsAuthenticated(true);
        setChannelData(channelResult.channelData[0]);
      } else {
        setIsAuthenticated(false);
        setChannelData(null);
        if (!channelResult.success) {
          setError(channelResult.error.message);
        } else {
          setError("No channel data found");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check authentication");
      setIsAuthenticated(false);
      setChannelData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStateAndChannelData();
  }, [artistAccountId, userAccountId]);

  return {
    isAuthenticated,
    isLoading,
    channelData,
    error,
    refetch: fetchAuthStateAndChannelData,
  };
} 