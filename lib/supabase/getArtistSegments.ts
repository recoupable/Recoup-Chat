import supabase from "./serverClient";

export interface ArtistSegment {
  id: string;
  name: string;
  size: number;
  icon?: string;
  artist_social_id: string;
  created_at: string;
}

interface RawArtistSegment {
  id: string;
  segment_name: string;
  fan_social_id: string;
  artist_social_id: string;
  updated_at: string;
}

export async function getArtistSegments(
  artistSocialIds: string[]
): Promise<ArtistSegment[]> {
  let allData: RawArtistSegment[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("artist_fan_segment")
      .select("*")
      .in("artist_social_id", artistSocialIds)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error("Error fetching artist segments:", error);
      return [];
    }

    if (!data || data.length === 0) break;

    allData = [...allData, ...data];

    if (data.length < pageSize) break;

    page++;
  }

  const segmentGroups = allData.reduce(
    (acc, segment) => {
      const key = segment.segment_name;
      if (!acc[key]) {
        acc[key] = {
          id: segment.id,
          name: segment.segment_name,
          size: 0,
          artist_social_id: segment.artist_social_id,
          created_at: segment.updated_at,
        };
      }
      acc[key].size++;
      return acc;
    },
    {} as Record<string, ArtistSegment>
  );

  const segments = Object.values(segmentGroups);

  return segments;
}
