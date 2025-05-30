import { useEffect, useState } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { ArtistRecord } from "@/types/Artist";
import { 
  YouTubeAccessResult as YouTubeAccessResultType,
  YouTubeStatusResponse,
  YouTubeChannelInfo
} from "@/types/youtube";

interface UseYouTubeAccessResult {
  selectedArtist: ArtistRecord | null;
  currentStatus: YouTubeStatusResponse | null;
  isCheckingStatus: boolean;
  currentChannelInfo: YouTubeChannelInfo | null;
  isAuthenticated: boolean;
  displayResult: YouTubeChannelInfo | {
    channel: {
      id: string;
      title: string;
      description: string;
      thumbnails: {
        default?: { url?: string };
        medium?: { url?: string };
        high?: { url?: string };
      };
      statistics: {
        subscriberCount: string;
        videoCount: string;
        viewCount: string;
      };
      customUrl?: string | null;
      country?: string | null;
      publishedAt: string;
    };
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
    channel: {
      id: result.channelInfo.id,
      title: result.channelInfo.name,
      description: "",
      thumbnails: {
        default: { url: result.channelInfo.thumbnails?.default },
        medium: { url: result.channelInfo.thumbnails?.medium },
        high: { url: result.channelInfo.thumbnails?.high },
      },
      statistics: {
        subscriberCount: result.channelInfo.subscriberCount || "0",
        videoCount: result.channelInfo.videoCount || "0",
        viewCount: result.channelInfo.viewCount || "0",
      },
      customUrl: result.channelInfo.customUrl,
      country: result.channelInfo.country,
      publishedAt: result.channelInfo.publishedAt || "",
    }
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