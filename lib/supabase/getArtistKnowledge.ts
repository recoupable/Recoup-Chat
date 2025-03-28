import supabase from "./serverClient";

export interface KnowledgeBaseEntry {
  url: string;
  name: string;
  type: string;
  content?: string;
}

export async function getArtistKnowledge(artistId: string): Promise<KnowledgeBaseEntry[]> {
  const { data, error } = await supabase
    .from("account_info")
    .select("knowledges")
    .eq("account_id", artistId)
    .single();
  
  if (error || !data?.knowledges) return [];
  return data.knowledges;
}

export default getArtistKnowledge; 