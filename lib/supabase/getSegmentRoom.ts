import supabase from "./serverClient";

export const getSegmentRoom = async (segmentId: string) => {
  const { data, error } = await supabase
    .from("segment_rooms")
    .select("*")
    .eq("segment_id", segmentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      console.log(`No segment room found for segmentId: ${segmentId}`);
      return null;
    }

    console.error("Unexpected error fetching segment room:", error);
    throw new Error(`Failed to fetch segment room: ${error.message}`);
  }

  return data;
};
