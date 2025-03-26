import supabase from "./serverClient";

export interface KnowledgeBaseEntry {
  url: string;
  name: string;
  type: string;
  content?: string;
}

export async function getArtistIdForRoom(roomId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("artist_id")
    .eq("id", roomId)
    .single();
  
  if (error || !data?.artist_id) return null;
  return data.artist_id;
}

export async function getKnowledgeEntries(artistId: string): Promise<KnowledgeBaseEntry[]> {
  const { data, error } = await supabase
    .from("account_info")
    .select("knowledges")
    .eq("account_id", artistId)
    .single();
  
  if (error || !data?.knowledges) return [];
  return data.knowledges;
} 