import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";

export interface Post {
  id: string;
  post_url: string;
  updated_at: string;
}

export interface PostsResponse {
  status: string;
  posts: Post[];
  pagination: {
    total_count: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface PostsError {
  message: string;
  status?: number;
}

interface FetchPostsParams {
  artistAccountId: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches posts for a specific artist from the API
 */
async function fetchPosts({
  artistAccountId,
  page = 1,
  limit = 20,
}: FetchPostsParams): Promise<PostsResponse> {
  console.log("[useArtistPosts] Fetching posts with params:", {
    artistAccountId,
    page,
    limit,
  });

  try {
    const url = new URL("https://api.recoupable.com/api/posts");
    url.searchParams.append("artist_account_id", artistAccountId);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    console.log("[useArtistPosts] Request URL:", url.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("[useArtistPosts] API request failed:", {
        status: response.status,
        statusText: response.statusText,
      });
      const error: PostsError = {
        message: "Failed to fetch posts",
        status: response.status,
      };
      throw error;
    }

    const data: PostsResponse = await response.json();
    console.log("[useArtistPosts] API response:", {
      status: data.status,
      postsCount: data.posts?.length ?? 0,
      pagination: data.pagination,
    });

    if (data.status !== "success") {
      console.error("[useArtistPosts] API returned error status:", data.status);
      throw { message: "API returned error status" } as PostsError;
    }

    return data;
  } catch (error) {
    console.error("[useArtistPosts] Error fetching posts:", error);
    // Ensure we're always throwing a consistent error shape
    if (typeof error === "object" && error !== null && "message" in error) {
      throw error;
    }
    throw { message: "An unexpected error occurred" } as PostsError;
  }
}

export type PostsInfiniteResponse = {
  pages: PostsResponse[];
  pageParams: number[];
};

/**
 * Hook to fetch and manage posts for an artist with infinite scrolling
 */
export function useArtistPosts(
  artistAccountId?: string,
  limit: number = 20
): UseInfiniteQueryResult<InfiniteData<PostsResponse>, PostsError> {
  return useInfiniteQuery<PostsResponse, PostsError>({
    queryKey: ["posts", artistAccountId, limit],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        artistAccountId: artistAccountId!,
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage: PostsResponse) => {
      const { page, total_pages } = lastPage.pagination;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!artistAccountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry network errors, not 4xx/5xx responses
      return failureCount < 2 && !("status" in error);
    },
  });
}
