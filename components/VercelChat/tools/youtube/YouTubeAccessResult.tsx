import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube, Users, Video, Eye, Calendar, Loader } from "lucide-react";
import { useArtistProvider } from "@/providers/ArtistProvider";

// Interface matching the checkYouTubeAccess tool result
interface YouTubeChannelInfo {
  success: boolean;
  status: string;
  message?: string;
  channelInfo?: {
    id: string;
    name: string;
    thumbnails?: {
      default?: string | null;
      medium?: string | null;
      high?: string | null;
    };
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
    customUrl?: string | null;
    country?: string | null;
    publishedAt?: string | null;
  };
}

interface YouTubeAccessResultProps {
  result: YouTubeChannelInfo;
}

interface YouTubeStatusResponse {
  authenticated: boolean;
  message: string;
  expiresAt?: number;
  createdAt?: number;
}

interface YouTubeChannelData {
  success: boolean;
  status: string;
  message?: string;
  channel?: {
    id: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url?: string | null };
      medium?: { url?: string | null };
      high?: { url?: string | null };
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
}

// Utility functions for formatting
function formatNumber(numStr: string): string {
  const num = parseInt(numStr, 10);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function YouTubeAccessResult({ result }: YouTubeAccessResultProps) {
  const { selectedArtist } = useArtistProvider();
  const [currentStatus, setCurrentStatus] = useState<YouTubeStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [currentChannelInfo, setCurrentChannelInfo] = useState<YouTubeChannelData | null>(null);

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
            const channelData: YouTubeChannelData = await channelResponse.json();
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

  // Success state - show channel information
  if (isAuthenticated && displayResult?.channel) {
    const { channel } = displayResult;
    const thumbnailUrl = channel.thumbnails.high?.url || 
                        channel.thumbnails.medium?.url || 
                        channel.thumbnails.default?.url;

    return (
      <div className="flex flex-col space-y-3 p-4 rounded-lg bg-red-50 border border-red-200 my-2 max-w-md">
        {/* Header with YouTube icon */}
        <div className="flex items-center space-x-2">
          <Youtube className="h-5 w-5 text-red-600" />
          <span className="font-medium text-red-800">YouTube Channel Connected</span>
          {currentStatus && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Live</span>
          )}
        </div>

        {/* Artist Context */}
        <div className="text-xs text-gray-600">
          Artist: <span className="font-medium">{selectedArtist.name}</span>
        </div>

        {/* Channel Info */}
        <div className="flex items-start space-x-3">
          {/* Channel Avatar */}
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt={channel.title}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <Youtube className="h-6 w-6 text-gray-600" />
            )}
          </div>

          {/* Channel Details */}
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{channel.title}</h3>
            {channel.customUrl && (
              <p className="text-sm text-gray-600">@{channel.customUrl}</p>
            )}
            {channel.country && (
              <p className="text-xs text-gray-500">{channel.country}</p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-red-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(channel.statistics.subscriberCount)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Subscribers</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Video className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(channel.statistics.videoCount)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Videos</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Eye className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(channel.statistics.viewCount)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Views</p>
          </div>
        </div>

        {/* Channel Created Date */}
        {channel.publishedAt && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 pt-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(channel.publishedAt)}</span>
          </div>
        )}
      </div>
    );
  }

  // Error state - show login button
  const errorMessage = currentStatus?.message || result.message || "Please connect your YouTube account to access channel information.";

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-800">YouTube Access Required</span>
        {currentStatus && (
          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Live</span>
        )}
      </div>

      {/* Artist Context */}
      <div className="text-xs text-gray-600">
        Artist: <span className="font-medium">{selectedArtist.name}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600">{errorMessage}</p>

      {/* Login Button */}
      <Button
        onClick={handleYouTubeLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        <Youtube className="h-4 w-4 mr-2" />
        Connect YouTube Account
      </Button>

      <p className="text-xs text-gray-500 text-center">
        You&apos;ll be redirected to Google to authorize access to your YouTube channel for this artist.
      </p>
    </div>
  );
}

export default YouTubeAccessResult; 