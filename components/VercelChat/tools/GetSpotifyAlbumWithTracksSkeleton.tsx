const GetSpotifyAlbumWithTracksSkeleton = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative rounded-2xl">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gray-800 rounded-t-2xl opacity-[0.999]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Album Cover Skeleton - Hidden on mobile */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="w-48 h-48 bg-gray-700 rounded-lg" />
            </div>

            {/* Album Info Skeleton */}
            <div className="flex-1 text-white">
              {/* Badge skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-16 bg-gray-600 rounded-full" />
              </div>

              {/* Title skeleton */}
              <div className="h-10 w-3/4 bg-gray-600 rounded mb-2" />

              {/* Artist skeleton */}
              <div className="h-5 w-1/2 bg-gray-600 rounded mb-3" />

              {/* Meta info skeleton */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <div className="h-4 w-12 bg-gray-600 rounded" />
                <div className="h-4 w-16 bg-gray-600 rounded" />
                <div className="h-4 w-14 bg-gray-600 rounded" />
              </div>

              {/* Button skeleton */}
              <div className="h-10 w-32 bg-gray-600 rounded-full mb-3" />

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-1.5">
                <div className="h-6 w-20 bg-gray-600 rounded-full" />
                <div className="h-6 w-16 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Listing Skeleton */}
      <div className="bg-black/40 backdrop-blur-sm rounded-b-2xl opacity-[0.999]">
        <div className="p-3 sm:p-4">
          <div className="space-y-0.5">
            {/* Generate 8-12 track skeletons */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl"
              >
                {/* Track Number */}
                <div className="w-4 sm:w-5 h-4 bg-gray-600 rounded" />

                {/* Track Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>

                {/* Duration */}
                <div className="w-8 h-3 bg-gray-600 rounded" />

                {/* Action button skeleton - Hidden on mobile */}
                <div className="w-3 h-3 bg-gray-600 rounded hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSpotifyAlbumWithTracksSkeleton; 