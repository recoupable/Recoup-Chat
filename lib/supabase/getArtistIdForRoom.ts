import supabase from "./serverClient";

export async function getArtistIdForRoom(roomId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("artist_id")
    .eq("id", roomId)
    .single();
  
  if (error || !data?.artist_id) return null;
  return data.artist_id;
}

export default getArtistIdForRoom; 