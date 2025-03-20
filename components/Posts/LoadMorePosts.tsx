interface LoadMorePostsProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null) => void;
}

const LoadMorePosts = ({
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
}: LoadMorePostsProps) => {
  if (!hasNextPage) return null;

  return (
    <div ref={loadMoreRef} className="flex justify-center py-4">
      {isFetchingNextPage ? (
        <div className="animate-pulse text-gray-500">Loading more posts...</div>
      ) : (
        <div className="h-10" />
      )}
    </div>
  );
};

export default LoadMorePosts;
