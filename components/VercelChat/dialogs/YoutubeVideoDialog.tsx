import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { YouTubeVideo } from "@/types/youtube";
import { formatDate } from "@/lib/utils/formatDate";
import { formatDuration } from "@/lib/youtube/formatDuration";
import { useState } from "react";

const YoutubeVideoDialog = ({
  children,
  video,
}: {
  children: React.ReactNode;
  video: YouTubeVideo;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-4 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle className="text-lg font-medium">YouTube Video</DialogTitle>
        </DialogHeader>
        
        {/* Video Embed - using iframe directly with video ID */}
        <div className="w-full aspect-video bg-black rounded-md overflow-hidden mb-4 shrink-0">
          {isOpen && (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=0`}
              title={video.snippet?.title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          )}
        </div>
        
        {/* Scrollable content area */}
        <div className="overflow-y-auto pr-1 flex-1 min-h-0">
          {/* Title - with text wrapping */}
          <h2 className="text-base font-medium mb-1 break-words line-clamp-2 hover:line-clamp-none">
            {video.snippet?.title}
          </h2>
          
          {/* Channel and stats - flexible layout */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mb-4 gap-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="truncate max-w-[150px]">{video.snippet?.channelTitle}</span>
              <span>•</span>
              <span>{formatDate(video.snippet?.publishedAt || "")}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>{parseInt(video.statistics?.viewCount || "0").toLocaleString()} views</span>
              <span>•</span>
              <span>{formatDuration(video.contentDetails?.duration || "")}</span>
            </div>
          </div>
          
          {/* Description - collapsed by default with better overflow handling */}
          <details className="mb-3 group">
            <summary className="text-xs font-medium cursor-pointer hover:text-blue-500">
              Description
            </summary>
            <div className="mt-2 max-h-[30vh] overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <p className="text-xs whitespace-pre-line text-gray-700 break-words">
                {video.snippet?.description}
              </p>
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YoutubeVideoDialog;
