import React from "react";
import { Users, Video, Eye, Calendar, MapPin, ExternalLink, Loader, CheckCircle, RefreshCcw } from "lucide-react";
import normalizeResult from "@/lib/youtube/mappers/normalizeResult";
import { YouTubeAccessResult as YouTubeAccessResultType } from "@/types/youtube";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";
import formatTimestamp from "@/lib/utils/formatTimestamp";
import { useYouTubeAccess } from "@/hooks/useYouTubeAccess";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function YouTubeAccessResult({ result }: { result: YouTubeAccessResultType }) {
  const { isCheckingStatus, isAuthenticated, login } = useYouTubeAccess(result);
  const normalizedResult = normalizeResult(result);
  const { channelInfo } = normalizedResult;
  // Handle missing or invalid data
  if (!normalizedResult || !channelInfo) {
    return (
      <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 text-gray-800 w-fit md:rounded-xl">
        <p>No data available for YouTube Account</p>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 text-gray-800 w-fit md:rounded-xl max-w-md">
      <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ channelInfo.thumbnails?.medium || channelInfo.thumbnails?.default || "" }
          alt={channelInfo.name || "Channel"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0 space-y-3 relative">
        <div className="absolute top-0 right-0">
          <Button variant="ghost" size="icon" onClick={() => login()} disabled={isCheckingStatus || isAuthenticated}
          >
            {isCheckingStatus ? (<Loader className="w-4 h-4 animate-spin" />) : isAuthenticated ? (<CheckCircle className="w-4 h-4 text-green-500" />) : (<RefreshCcw className="w-4 h-4" />)}
          </Button>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-sm leading-tight truncate">
            {channelInfo.name || "Unknown Channel"}
          </h3>
          <p className="text-xs text-gray-500">
            {channelInfo.customUrl || "No custom URL"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Users className="w-3 h-3 text-gray-500" />
            </div>
            <div className="text-xs font-medium text-gray-800">
              {formatFollowerCount(Number(channelInfo.subscriberCount) || 0)}
            </div>
            <div className="text-xs text-gray-500">Subscribers</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Video className="w-3 h-3 text-gray-500" />
            </div>
            <div className="text-xs font-medium text-gray-800">
              {formatFollowerCount(Number(channelInfo.videoCount) || 0)}
            </div>
            <div className="text-xs text-gray-500">Videos</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Eye className="w-3 h-3 text-gray-500" />
            </div>
            <div className="text-xs font-medium text-gray-800">
              {formatFollowerCount(Number(channelInfo.viewCount) || 0)}
            </div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
        </div>
        <div className="space-y-1.5 pt-1 border-t border-gray-200">
          {channelInfo.country && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{channelInfo.country}</span>
            </div>
          )}
          {channelInfo.publishedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                Created {formatTimestamp(channelInfo.publishedAt, true)}
              </span>
            </div>
          )}
          {channelInfo.customUrl && (
            <Link
              href={`https://youtube.com/${channelInfo.customUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Channel</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
