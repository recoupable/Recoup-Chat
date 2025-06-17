import { Loader } from "lucide-react";

export default function SpotifyDeepResearchSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 border rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 border-b pb-3">
        <Loader className="h-5 w-5 animate-spin text-primary" />
        <h3 className="font-semibold text-sm md:text-base">Deep Researching Spotify Artist...</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Artist Socials</h4>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center p-4 border rounded-xl ${
                i % 4 === 0 ? "bg-[#1DB954]/10 border-[#1DB954]/20" : 
                i % 4 === 1 ? "bg-gradient-to-br from-[#FCAF45]/10 via-[#E1306C]/10 to-[#5851DB]/10 border-[#E1306C]/20" :
                i % 4 === 2 ? "bg-[#1DA1F2]/10 border-[#1DA1F2]/20" :
                "bg-[#FF0000]/10 border-[#FF0000]/20"
              }`}
            >
              <div className="w-12 h-12 mb-3 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
