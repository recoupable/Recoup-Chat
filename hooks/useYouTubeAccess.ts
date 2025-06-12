/**
 * YouTube Access Management Hook
 *
 * Custom React hook that manages YouTube authentication state and OAuth flow.
 *
 * PROVIDES:
 * - Current authentication status and channel info
 * - OAuth login function for YouTube authentication
 * - Loading states during authentication checks
 * - Combined display result from static/live data
 *
 * FUNCTIONALITY:
 * - Checks authentication status on mount for selected artist
 * - Fetches live channel data if authenticated
 * - Initiates OAuth flow with account context preservation
 * - Handles state management for YouTube components
 */

import { useEffect, useState } from "react";
import {
  YouTubeAccessResult as YouTubeAccessResultType,
  YouTubeStatusResponse,
  YouTubeChannelData,
} from "@/types/youtube";
import { useUserProvider } from "@/providers/UserProvder";

interface UseYouTubeAccessResult {
  status: YouTubeStatusResponse | null;
  isCheckingStatus: boolean;
  isAuthenticated: boolean;
  channelInfo: YouTubeChannelData[] | null;
  login: () => void;
}

export function useYouTubeAccess(
  result: YouTubeAccessResultType
): UseYouTubeAccessResult {
  const [status, setStatus] = useState<YouTubeStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { userData } = useUserProvider();
  const account_id = userData?.account_id;

  // State for array of channel info
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelData[] | null>();

  // Helper function to initiate YouTube OAuth flow with artist context
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/google`;

    // Updated scopes to include YouTube Analytics and monetary data
    const scopes = [
      "https://www.googleapis.com/auth/youtube.readonly", // Base YouTube access
      "https://www.googleapis.com/auth/yt-analytics.readonly", // Analytics data e.g. views, likes, comments etc.
      "https://www.googleapis.com/auth/yt-analytics-monetary.readonly", // Revenue/monetization data e.g. ad revenue, channel membership, etc.
    ];

    // Get current path to redirect back after authentication
    const currentPath = window.location.pathname + window.location.search;

    // Create state object with path and account_id
    const stateData = {
      path: currentPath,
      account_id,
    };

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes.join(" "))}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(JSON.stringify(stateData))}`;

    window.open(authUrl, "_blank");
  };

  // Check current authentication status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!account_id) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        console.log("account_id", account_id);
        const response = await fetch(
          `/api/youtube/status?account_id=${encodeURIComponent(account_id)}`
        );
        const statusData: YouTubeStatusResponse = await response.json();
        setStatus(statusData);
        console.log("statusData", statusData);

        // If authenticated, fetch current channel info and update our state
        if (statusData.authenticated) {
          const channelResponse = await fetch(
            `/api/youtube/channel-info?account_id=${encodeURIComponent(account_id)}`
          );
          if (channelResponse.ok) {
            const liveChannelData: { channels: YouTubeChannelData[] } =
              await channelResponse.json();
            setChannelInfo(
              Array.isArray(liveChannelData.channels)
                ? liveChannelData.channels
                : null
            );
          }
        }
      } catch (error) {
        console.error("Error checking YouTube status:", error);
        setStatus({
          authenticated: false,
          message: "Failed to check authentication status",
        });
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [account_id]);

  const isAuthenticated = status?.authenticated ?? result.success;

  return {
    status,
    isCheckingStatus,
    isAuthenticated,
    channelInfo,
    login,
  };
}
