import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube, Users, Video, Eye, Calendar, Loader } from "lucide-react";

// Interface matching the checkYouTubeAccess tool result
interface YouTubeChannelInfo {
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

interface YouTubeAccessResultProps {
  result: YouTubeChannelInfo;
}

interface YouTubeStatusResponse {
  authenticated: boolean;
  message: string;
  expiresAt?: number;
  createdAt?: number;
}

// Helper function to format large numbers
function formatNumber(num: string): string {
  const number = parseInt(num);
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toLocaleString();
}

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

// Helper function to initiate YouTube OAuth flow
function handleYouTubeLogin() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`;
  const scope = "https://www.googleapis.com/auth/youtube.readonly";
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  window.open(authUrl, '_blank');
}

export function YouTubeAccessResult({ result }: YouTubeAccessResultProps) {
  const [currentStatus, setCurrentStatus] = useState<YouTubeStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [currentChannelInfo, setCurrentChannelInfo] = useState<YouTubeChannelInfo | null>(null);

  // Check current authentication status on mount
  useEffect(() => {
    const checkCurrentStatus = async () => {
      try {
        const response = await fetch('/api/auth/youtube/status');
        const status: YouTubeStatusResponse = await response.json();
        setCurrentStatus(status);

        // If authenticated, fetch current channel info
        if (status.authenticated) {
          // We can either call the checkYouTubeAccess tool endpoint or create a simpler channel info endpoint
          // For now, let's create a simple channel info fetch
          const channelResponse = await fetch('/api/auth/youtube/channel-info');
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
  }, []);

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

  // Use current status if available, otherwise fall back to static result
  const displayResult = currentChannelInfo || result;
  const isAuthenticated = currentStatus?.authenticated ?? result.success;

  // Success state - show channel information
  if (isAuthenticated && displayResult.channel) {
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
        You&apos;ll be redirected to Google to authorize access to your YouTube channel.
      </p>
    </div>
  );
}

export default YouTubeAccessResult; 