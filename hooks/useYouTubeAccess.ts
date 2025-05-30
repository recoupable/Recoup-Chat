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
import { ArtistRecord } from "@/types/Artist";
import { 
  YouTubeAccessResult as YouTubeAccessResultType,
  YouTubeStatusResponse,
  YouTubeChannelInfo,
  YouTubeChannelData
} from "@/types/youtube";
import mapRawChannelInfoToChannelData  from "@/lib/youtube/mappers/mapRawChannelInfoToChannelData";

interface UseYouTubeAccessResult {
  status: YouTubeStatusResponse | null;
  isCheckingStatus: boolean;
  isAuthenticated: boolean;
  channelInfo: YouTubeChannelInfo | { channel: YouTubeChannelData; } | null;
  login: () => void;
}

export function useYouTubeAccess(result: YouTubeAccessResultType, selectedArtist: ArtistRecord | null): UseYouTubeAccessResult {
  const [status, setStatus] = useState<YouTubeStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Single state for channel info - starts with static data, updates with live data
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo | { channel: YouTubeChannelData; } | null>(
    result.channelInfo ? {
      ...result,
      channel: mapRawChannelInfoToChannelData(result.channelInfo)
    } : null
  );

  // Helper function to initiate YouTube OAuth flow with artist context
  const login = () => {
    if (!selectedArtist?.account_id) {
      console.error("No artist selected for YouTube authentication");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/google`;
    const scope = "https://www.googleapis.com/auth/youtube.readonly";
    
    // Get current path to redirect back after authentication
    const currentPath = window.location.pathname + window.location.search;
    
    // Create state object with path and account_id
    const stateData = {
      path: currentPath,
      account_id: selectedArtist.account_id
    };
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(JSON.stringify(stateData))}`;
    
    window.open(authUrl, '_blank');
  };

  // Check current authentication status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!selectedArtist?.account_id) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/youtube/status?account_id=${encodeURIComponent(selectedArtist.account_id)}`);
        const statusData: YouTubeStatusResponse = await response.json();
        setStatus(statusData);

        // If authenticated, fetch current channel info and update our single state
        if (statusData.authenticated) {
          const channelResponse = await fetch(`/api/auth/youtube/channel-info?account_id=${encodeURIComponent(selectedArtist.account_id)}`);
          if (channelResponse.ok) {
            const liveChannelData: YouTubeChannelInfo = await channelResponse.json();
            setChannelInfo(liveChannelData); // Update with live data
          }
        }
      } catch (error) {
        console.error('Error checking YouTube status:', error);
        setStatus({ authenticated: false, message: 'Failed to check authentication status' });
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [selectedArtist?.account_id]);
  
  const isAuthenticated = status?.authenticated ?? result.success;

  return {
    status,
    isCheckingStatus,
    isAuthenticated,
    channelInfo,
    login,
  };
} 