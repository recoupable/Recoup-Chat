import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export interface Post {
  id: string;
  post_url: string;
  updated_at: string;
}

export interface PostsResponse {
  status: string;
  posts: Post[];
}

export interface PostsError {
  message: string;
  status?: number;
}

/**
 * Fetches posts for a specific artist from the API
 */
async function fetchPosts(artistAccountId: string): Promise<Post[]> {
  try {
    const response = await fetch(
      `https://api.recoupable.com/api/posts?artist_account_id=${artistAccountId}`
    );

    if (!response.ok) {
      const error: PostsError = {
        message: "Failed to fetch posts",
        status: response.status,
      };
      throw error;
    }

    const data: PostsResponse = await response.json();

    if (data.status !== "success") {
      throw { message: "API returned error status" } as PostsError;
    }

    return data.posts;
  } catch (error) {
    // Ensure we're always throwing a consistent error shape
    if (typeof error === "object" && error !== null && "message" in error) {
      throw error;
    }
    throw { message: "An unexpected error occurred" } as PostsError;
  }
}

/**
 * Hook to fetch and manage posts for an artist
 */
export function useArtistPosts(
  artistAccountId?: string
): UseQueryResult<Post[], PostsError> {
  return useQuery({
    queryKey: ["posts", artistAccountId],
    queryFn: () => fetchPosts(artistAccountId!),
    enabled: !!artistAccountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry network errors, not 4xx/5xx responses
      return failureCount < 2 && !("status" in error);
    },
  });
}
