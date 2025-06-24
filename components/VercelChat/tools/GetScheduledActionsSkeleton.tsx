const GetScheduledActionsSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-2xl">
      {/* Header Skeleton */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mt-1" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Skeleton for multiple action cards */}
          {[1, 2].map((index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-lg p-3 bg-gray-50"
            >
              {/* Action header skeleton */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>
              
              {/* Action content skeleton */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Action footer skeleton */}
              <div className="flex items-center justify-between mt-3">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetScheduledActionsSkeleton;