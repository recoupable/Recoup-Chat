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
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import { 
  YouTubeAccessResult as YouTubeAccessResultType,
  YouTubeStatusResponse,
  YouTubeChannelInfo,
  YouTubeChannelData
} from "@/types/youtube";
import { mapRawChannelInfoToChannelData } from "@/lib/youtube/channel-mapper";

interface UseYouTubeAccessResult {
  selectedArtist: ArtistRecord | null;
  currentStatus: YouTubeStatusResponse | null;
  isCheckingStatus: boolean;
  currentChannelInfo: YouTubeChannelInfo | null;
  isAuthenticated: boolean;
  displayResult: YouTubeChannelInfo | {
    channel: YouTubeChannelData;
  } | null;
  handleYouTubeLogin: () => void;
}

export function useYouTubeAccess(result: YouTubeAccessResultType): UseYouTubeAccessResult {
  const { selectedArtist } = useArtistProvider();
  const [currentStatus, setCurrentStatus] = useState<YouTubeStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [currentChannelInfo, setCurrentChannelInfo] = useState<YouTubeChannelInfo | null>(null);

  // Helper function to initiate YouTube OAuth flow with artist context
  const handleYouTubeLogin = () => {
    if (!selectedArtist?.account_id) {
      console.error("No artist selected for YouTube authentication");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;
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
    const checkCurrentStatus = async () => {
      if (!selectedArtist?.account_id) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/youtube/status?account_id=${encodeURIComponent(selectedArtist.account_id)}`);
        const status: YouTubeStatusResponse = await response.json();
        setCurrentStatus(status);

        // If authenticated, fetch current channel info
        if (status.authenticated) {
          const channelResponse = await fetch(`/api/auth/youtube/channel-info?account_id=${encodeURIComponent(selectedArtist.account_id)}`);
          if (channelResponse.ok) {
            const channelData: YouTubeChannelInfo = await channelResponse.json();
            setCurrentChannelInfo(channelData);
          }
        }
      } catch (error) {
        console.error('Error checking YouTube status:', error);
        setCurrentStatus({ authenticated: false, message: 'Failed to check authentication status' });
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkCurrentStatus();
  }, [selectedArtist?.account_id]);

  // Use current status if available, otherwise fall back to static result
  const displayResult = currentChannelInfo || (result.channelInfo ? {
    ...result,
    channel: mapRawChannelInfoToChannelData(result.channelInfo)
  } : null);
  
  const isAuthenticated = currentStatus?.authenticated ?? result.success;

  return {
    selectedArtist,
    currentStatus,
    isCheckingStatus,
    currentChannelInfo,
    isAuthenticated,
    displayResult,
    handleYouTubeLogin,
  };
} 