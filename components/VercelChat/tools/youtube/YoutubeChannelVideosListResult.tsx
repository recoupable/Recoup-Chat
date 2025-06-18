import { YouTubeChannelVideoListResult } from "@/types/youtube";
import YoutubeVideoCard from "./YoutubeVideoCard";

const YoutubeChannelVideosListResult = ({ result }: { result: YouTubeChannelVideoListResult }) => {
  if (!result.success) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
        {result.message || "Failed to fetch videos"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
      {result.videos.map((video) => (
        <YoutubeVideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default YoutubeChannelVideosListResult;
