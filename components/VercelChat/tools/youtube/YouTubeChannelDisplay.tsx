import React from "react";
import { Youtube, Users, Video, Eye, Calendar } from "lucide-react";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import formatTimestamp from "@/lib/utils/formatTimestamp";

interface ChannelData {
  id: string;
  title: string;
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
}

interface YouTubeChannelDisplayProps {
  channel: ChannelData;
  artistName: string;
  isLive?: boolean;
}

export function YouTubeChannelDisplay({ channel, artistName, isLive }: YouTubeChannelDisplayProps) {
  const thumbnailUrl = channel.thumbnails.high?.url || 
                      channel.thumbnails.medium?.url || 
                      channel.thumbnails.default?.url;

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-red-50 border border-red-200 my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-red-600" />
        <span className="font-medium text-red-800">YouTube Channel Connected</span>
        {isLive && (
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Live</span>
        )}
      </div>

      {/* Artist Context */}
      <div className="text-xs text-gray-600">
        Artist: <span className="font-medium">{artistName}</span>
      </div>

      {/* Channel Info */}
      <div className="flex items-start space-x-3">
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

        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{channel.title}</h3>
          {channel.customUrl && <p className="text-sm text-gray-600">@{channel.customUrl}</p>}
          {channel.country && <p className="text-xs text-gray-500">{channel.country}</p>}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-red-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Users className="h-3 w-3 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {formatFollowerCount(parseInt(channel.statistics.subscriberCount, 10))}
            </span>
          </div>
          <p className="text-xs text-gray-500">Subscribers</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Video className="h-3 w-3 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {formatFollowerCount(parseInt(channel.statistics.videoCount, 10))}
            </span>
          </div>
          <p className="text-xs text-gray-500">Videos</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Eye className="h-3 w-3 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {formatFollowerCount(parseInt(channel.statistics.viewCount, 10))}
            </span>
          </div>
          <p className="text-xs text-gray-500">Views</p>
        </div>
      </div>

      {/* Channel Created Date */}
      {channel.publishedAt && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 pt-1">
          <Calendar className="h-3 w-3" />
          <span>Created {formatTimestamp(channel.publishedAt)}</span>
        </div>
      )}
    </div>
  );
} 