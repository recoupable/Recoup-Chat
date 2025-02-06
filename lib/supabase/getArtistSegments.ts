import supabase from "./serverClient";

export interface ArtistSegment {
  id: string;
  name: string;
  size: number;
  icon?: string;
  artist_social_id: string;
  created_at: string;
}

export async function getArtistSegments(
  artistSocialIds: string[]
): Promise<ArtistSegment[]> {
  const { data, error } = await supabase
    .from("artist_fan_segment")
    .select("*")
    .in("artist_social_id", artistSocialIds);
  console.log("data", data);
  if (error) {
    console.error("Error fetching artist segments:", error);
    return [];
  }

  return data || [];
}
