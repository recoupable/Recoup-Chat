import { useArtistProvider } from "@/providers/ArtistProvider";
import { useArtistPosts, type Post } from "@/hooks/useArtistPosts";
import Posts from "./Posts";
import PostsSkeleton from "./PostsSkeleton";
import { useCallback } from "react";
import { useInView } from "react-intersection-observer";

const POSTS_PER_PAGE = 20; // Match API default

const PostsWrapper = () => {
  const { selectedArtist } = useArtistProvider();
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArtistPosts(selectedArtist?.account_id, POSTS_PER_PAGE);

  console.log("[PostsWrapper] Rendering with:", {
    selectedArtistId: selectedArtist?.account_id,
    hasNextPage,
    isFetchingNextPage,
    pagesData: data?.pages,
  });

  // Combine all posts from all pages and sort them
  const allPosts =
    data?.pages?.reduce((acc: Post[], page) => {
      return [...acc, ...page.posts];
    }, []) ?? [];

  const sortedPosts = [...allPosts].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  console.log("[PostsWrapper] Posts data:", {
    totalPosts: allPosts.length,
    sortedPostsCount: sortedPosts.length,
    totalAvailable: data?.pages[0]?.pagination.total_count,
    currentPage: data?.pages?.length,
    totalPages: data?.pages[0]?.pagination.total_pages,
  });

  // Load more posts when the load more element comes into view
  const loadMorePosts = useCallback(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("[PostsWrapper] Loading more posts");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Call loadMorePosts when inView changes
  if (inView) {
    loadMorePosts();
  }

  if (!selectedArtist || isLoading) {
    console.log("[PostsWrapper] Loading state:", {
      hasSelectedArtist: !!selectedArtist,
      isLoading,
    });
    return <PostsSkeleton />;
  }

  if (error) {
    console.error("[PostsWrapper] Error state:", error);
    return (
      <div className="text-lg text-center text-red-500 py-8">
        Failed to load posts: {error.message}
      </div>
    );
  }

  if (!sortedPosts.length) {
    console.log("[PostsWrapper] No posts found");
    return (
      <div className="text-lg text-center py-8">
        No posts found for this artist.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Posts
        posts={sortedPosts}
        hasNextPage={hasNextPage}
        fetchNextPage={loadMorePosts}
        isFetchingNextPage={isFetchingNextPage}
      />

      {/* Load more trigger element */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="animate-pulse text-gray-500">
              Loading more posts...
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
    </div>
  );
};

export default PostsWrapper;
