import { getArtistIdForRoom, getKnowledgeEntries } from "./supabase/getArtistKnowledge";

const SUPPORTED_TEXT_TYPES = ["text/plain", "text/markdown", "application/json"];

export async function getKnowledgeBaseContext(roomId: string): Promise<string> {
  try {
    const artistId = await getArtistIdForRoom(roomId);
    if (!artistId) return "";

    const knowledgeEntries = await getKnowledgeEntries(artistId);
    if (!knowledgeEntries.length) return "";
    
    const textualEntries = knowledgeEntries.filter(entry => 
      entry.content && SUPPORTED_TEXT_TYPES.includes(entry.type)
    );
    
    if (!textualEntries.length) return "";
    
    return textualEntries
      .map(entry => `--- ${entry.name} ---\n${entry.content}`)
      .join("\n\n");
  } catch (error) {
    console.error("[getKnowledgeBaseContext]", error);
    return "";
  }
}

export default getKnowledgeBaseContext; 