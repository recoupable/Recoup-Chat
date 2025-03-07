const PostsSkeleton = () => {
  // Create an array of 6 items for the skeleton
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletonItems.map((item) => (
        <div
          key={item}
          className="border rounded-lg overflow-hidden shadow-sm bg-white h-[300px] flex flex-col animate-pulse"
        >
          <div className="p-3 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="flex-grow bg-gray-100 flex items-center justify-center">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsSkeleton;
