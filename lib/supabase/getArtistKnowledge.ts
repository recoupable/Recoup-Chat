import getCache from "../redis/getCache";
import setCache from "../redis/setCache";
import { getArtistKnowledgeCacheKey } from "../redis/keys";
import supabase from "./serverClient";

export interface KnowledgeBaseEntry {
  url: string;
  name: string;
  type: string;
}

export async function getArtistKnowledge(artistId: string): Promise<KnowledgeBaseEntry[]> {
  const cacheKey = getArtistKnowledgeCacheKey(artistId);

  const cachedData = await getCache<KnowledgeBaseEntry[]>(cacheKey);
  if (cachedData) return cachedData;

  // If not in cache, fetch from database
  const { data, error } = await supabase
    .from("account_info")
    .select("knowledges")
    .eq("account_id", artistId)
    .single();

  const knowledges: KnowledgeBaseEntry[] =
    error || !data?.knowledges ? [] : data.knowledges;

  try {
    await setCache(cacheKey, JSON.stringify(knowledges, null, 2));
  } catch (error) {
    console.error("Failed to cache artist knowledge:", error);
  }

  return knowledges;
}

export default getArtistKnowledge;
