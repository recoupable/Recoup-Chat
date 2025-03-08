import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

export interface Social {
  id: string;
  username: string;
  avatar: string | null;
  profile_url: string;
  region: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  updated_at: string;
}

export interface FansResponse {
  status: string;
  fans: Social[];
  pagination: {
    total_count: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface FansError {
  message: string;
  status?: number;
}

/**
 * Fetches fans for a specific artist from the API with pagination
 */
async function fetchFans(
  artistAccountId: string,
  page: number = 1,
  limit: number = 20
): Promise<FansResponse> {
  try {
    const response = await fetch(
      `https://api.recoupable.com/api/fans?artist_account_id=${artistAccountId}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      const error: FansError = {
        message: "Failed to fetch fans",
        status: response.status,
      };
      throw error;
    }

    const data: FansResponse = await response.json();

    if (data.status !== "success") {
      throw { message: "API returned error status" } as FansError;
    }

    return data;
  } catch (error) {
    // Ensure we're always throwing a consistent error shape
    if (typeof error === "object" && error !== null && "message" in error) {
      throw error;
    }
    throw { message: "An unexpected error occurred" } as FansError;
  }
}

/**
 * Hook to fetch and manage fans for an artist with infinite scrolling
 */
export function useArtistFans(
  artistAccountId?: string,
  limit: number = 20
): UseInfiniteQueryResult<FansResponse, FansError> {
  return useInfiniteQuery({
    queryKey: ["fans", artistAccountId, limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchFans(artistAccountId!, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      // If we're on the last page, return undefined to indicate no more pages
      if (pagination.page >= pagination.total_pages) {
        return undefined;
      }
      // Otherwise, return the next page number
      return pagination.page + 1;
    },
    enabled: !!artistAccountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry network errors, not 4xx/5xx responses
      return failureCount < 2 && !("status" in error);
    },
  });
}
