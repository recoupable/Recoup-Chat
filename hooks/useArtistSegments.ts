import { type Segment } from "@/lib/supabase/getSegments";
import { useQuery } from "@tanstack/react-query";

async function fetchSegments(artistId: string): Promise<Segment[]> {
  const response = await fetch(`/api/segments?artistId=${artistId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch segments");
  }
  return response.json();
}

export function useArtistSegments(artistId?: string) {
  return useQuery({
    queryKey: ["segments", artistId],
    queryFn: () => fetchSegments(artistId!),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
