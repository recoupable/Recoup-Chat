import supabase from "./serverClient";

/**
 * Fetches room details for a specific room ID
 */
export const getRoomDetails = async (roomId: string) => {
  try {
    console.log(`Fetching room details for room ID: ${roomId}`);
    
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      console.error("Error fetching room details:", error);
      return null;
    }

    console.log(`Room details fetched successfully:`, {
      id: data.id,
      topic: data.topic,
      artist_id: data.artist_id
    });
    
    return data;
  } catch (error) {
    console.error("Unexpected error fetching room details:", error);
    return null;
  }
}; 