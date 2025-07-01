import { ThumbsUp, ThumbsDown, MessageSquare, Heart, Eye } from "lucide-react";
import { formatDuration } from "@/lib/youtube/formatDuration";
import { YouTubeVideo } from "@/types/youtube";

interface YoutubeVideoStatsProps {
  statistics?: YouTubeVideo["statistics"];
  duration?: string;
}

const YoutubeVideoStats = ({ statistics, duration }: YoutubeVideoStatsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>{parseInt(statistics?.viewCount || "0").toLocaleString()} views</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsUp className="w-4 h-4" />
        <span>{parseInt(statistics?.likeCount || "0").toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsDown className="w-4 h-4" />
        <span>{parseInt(statistics?.dislikeCount || "0").toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="w-4 h-4" />
        <span>{parseInt(statistics?.commentCount || "0").toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <Heart className="w-4 h-4" />
        <span>{parseInt(statistics?.favoriteCount || "0").toLocaleString()}</span>
      </div>
      {duration && (
        <div className="flex items-center gap-1">
          <span>{formatDuration(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default YoutubeVideoStats; 