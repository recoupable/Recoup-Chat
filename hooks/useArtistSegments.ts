import { type ArtistSegment } from "@/lib/supabase/getArtistSegments";
import { useQuery } from "@tanstack/react-query";

async function fetchSegments(
  artistSocialIds: string[],
): Promise<ArtistSegment[]> {
  const queryString = artistSocialIds.map((id) => `artistId=${id}`).join("&");
  const response = await fetch(`/api/segments?${queryString}`);
  if (!response.ok) {
    throw new Error("Failed to fetch segments");
  }
  return response.json();
}

export function useArtistSegments(artistSocialIds?: string[]) {
  return useQuery({
    queryKey: ["segments", artistSocialIds],
    queryFn: () => fetchSegments(artistSocialIds!),
    enabled: !!artistSocialIds?.length,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
