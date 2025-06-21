import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { 
  TimelineMoment, 
  TimelineApiResponse, 
  TimelineApiError 
} from "@/types/Timeline";

interface UseTimelineApiOptions {
  artistId?: string;
  limit?: number;
  includeHidden?: boolean;
}

async function fetchTimelineMoments(
  artistId: string,
  limit: number = 20,
  includeHidden: boolean = false
): Promise<TimelineMoment[]> {
  try {
    const params = new URLSearchParams({
      artistId,
      limit: limit.toString(),
      includeHidden: includeHidden.toString(),
    });

    const response = await fetch(`/api/timeline?${params}`);

    if (!response.ok) {
      const error: TimelineApiError = {
        message: "Failed to fetch timeline moments",
        code: "FETCH_ERROR",
        status: response.status,
      };
      throw error;
    }

    const data: TimelineApiResponse = await response.json();

    if (data.status !== "success") {
      throw {
        message: "API returned error status",
        code: "API_ERROR",
      } as TimelineApiError;
    }

    return data.moments || [];
  } catch (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      throw error;
    }
    throw {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    } as TimelineApiError;
  }
}

/**
 * Hook to fetch timeline moments for an artist
 * Returns TimelineMoment[] that can be used with components like HideButton
 */
export function useTimelineApi({
  artistId,
  limit = 20,
  includeHidden = false,
}: UseTimelineApiOptions): UseQueryResult<TimelineMoment[], TimelineApiError> {
  return useQuery({
    queryKey: ["timeline", artistId, limit, includeHidden],
    queryFn: () => fetchTimelineMoments(artistId!, limit, includeHidden),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount: number, error: TimelineApiError) => {
      return failureCount < 2 && !("status" in error);
    },
  });
}