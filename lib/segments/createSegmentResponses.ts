import { Tables } from "@/types/database.types";

interface CreateArtistSegmentsSuccessData {
  segments: Tables<"segments">[];
  artist_segments: Tables<"artist_segments">[];
  segment_names: string[];
}

export const successResponse = (
  message: string,
  data: CreateArtistSegmentsSuccessData,
  count: number
) => ({
  success: true,
  status: "success",
  message,
  data,
  count,
});

export const errorResponse = (message: string) => ({
  success: false,
  status: "error",
  message,
  data: [],
  count: 0,
});
