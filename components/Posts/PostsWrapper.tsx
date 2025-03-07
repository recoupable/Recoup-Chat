import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistPosts } from "@/hooks/useArtistPosts";
import Posts from "./Posts";
import PostsSkeleton from "./PostsSkeleton";
import { useState, useCallback, useEffect } from "react";

const POSTS_PER_PAGE = 6; // Number of posts to show initially and load each time

const PostsWrapper = () => {
  const { selectedArtist } = useArtistProvider();
  const {
    data: posts,
    isLoading,
    error,
  } = useArtistPosts(selectedArtist?.account_id);

  // State to track how many posts to display
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);
  // Track if we're currently loading more posts
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset displayCount when the artist changes
  useEffect(() => {
    setDisplayCount(POSTS_PER_PAGE);
    setIsLoadingMore(false);
  }, [selectedArtist?.account_id]);

  // Calculate if there are more posts to load - default to false when posts aren't loaded yet
  const sortedPosts = posts
    ? [...posts].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    : [];
  const visiblePosts = sortedPosts.slice(0, displayCount);
  const hasMorePosts = sortedPosts.length > displayCount;

  // Function to load more posts - moved to top level before conditional returns
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore || !hasMorePosts) return;

    setIsLoadingMore(true);
    // Use setTimeout to prevent immediate state updates causing infinite loops
    setTimeout(() => {
      setDisplayCount((prevCount) => prevCount + POSTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [hasMorePosts, isLoadingMore]);

  if (!selectedArtist || isLoading) {
    return <PostsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-lg text-center text-red-500 py-8">
        Failed to load posts: {error.message}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-lg text-center py-8">
        No posts found for this artist.
      </div>
    );
  }

  return (
    <Posts
      posts={visiblePosts}
      hasNextPage={hasMorePosts}
      fetchNextPage={loadMorePosts}
      isFetchingNextPage={isLoadingMore}
    />
  );
};

export default PostsWrapper;
