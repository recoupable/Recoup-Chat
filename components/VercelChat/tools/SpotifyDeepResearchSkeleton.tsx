import { Loader } from "lucide-react";

export default function SpotifyDeepResearchSkeleton({ title }: { title?: string }) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg animate-pulse">
      <div className="flex items-center gap-2">
        <Loader className="h-5 w-5 animate-spin text-primary" />
        <h3 className="font-medium text-sm md:text-base">{title ?? "Deep Researching Spotify Artist..."}</h3>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium">Artist Socials</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center p-3 border rounded-lg">
              <div className="w-12 h-12 mb-2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
