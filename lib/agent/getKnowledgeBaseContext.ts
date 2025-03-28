import getArtistIdForRoom from "@/lib/supabase/getArtistIdForRoom";
import getArtistKnowledge from "@/lib/supabase/getArtistKnowledge";

export async function getKnowledgeBaseContext(roomId: string): Promise<string> {
  try {
    const artistId = await getArtistIdForRoom(roomId);
    if (!artistId) return "";

    const knowledges = await getArtistKnowledge(artistId);
    if (!knowledges.length) return "";
    
    const textFiles = knowledges.filter(file => 
      file.content && ["text/plain", "text/markdown", "application/json"].includes(file.type)
    );
    
    return textFiles.length > 0 
      ? textFiles.map(file => `--- ${file.name} ---\n${file.content}`).join("\n\n")
      : "";
  } catch (error) {
    console.error("[getKnowledgeBaseContext]", error);
    return "";
  }
}

export default getKnowledgeBaseContext; 