import { type Segment } from "@/lib/supabase/getArtistSegments";
import { useQuery } from "@tanstack/react-query";

async function fetchSegments(artistId: string): Promise<Segment[]> {
  console.log("[ArtistSegments] Fetching:", {
    artistId,
    timestamp: new Date().toISOString(),
  });

  const response = await fetch(`/api/segments?artistId=${artistId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch segments");
  }
  const segments: Segment[] = await response.json();

  console.log("[ArtistSegments] Fetched:", {
    artistId,
    segmentsCount: segments.length,
    segments: segments.map((s) => ({ id: s.id, name: s.name, size: s.size })),
    timestamp: new Date().toISOString(),
  });

  return segments.filter((s) => s.size > 0);
}

export function useArtistSegments(artistId?: string) {
  const query = useQuery({
    queryKey: ["segments", artistId],
    queryFn: () => fetchSegments(artistId!),
    enabled: !!artistId,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Log React Query state changes
  console.log("[ArtistSegments] Query State:", {
    artistId,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isStale: query.isStale,
    dataUpdatedAt: query.dataUpdatedAt,
    hasData: !!query.data,
    dataLength: query.data?.length,
    timestamp: new Date().toISOString(),
  });

  return query;
}
