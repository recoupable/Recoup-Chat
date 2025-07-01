import { YouTubeVideo } from "@/types/youtube";
import { formatDistanceToNow } from "date-fns";

const YoutubeVideoCard = ({ video }: { video: YouTubeVideo }) => {
  return (
    <div
      key={video.id}
      className="group rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
          {video.contentDetails.duration.replace("PT", "").toLowerCase()}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-2 sm:p-3">
        <h3 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors text-left">
          {video.snippet.title}
        </h3>
        <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[9px] sm:text-xs text-gray-500 text-left">
          <span>
            {parseInt(video.statistics.viewCount).toLocaleString()} views
          </span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(video.snippet.publishedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideoCard;
