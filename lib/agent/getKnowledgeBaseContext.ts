import getArtistIdForRoom from "@/lib/supabase/getArtistIdForRoom";
import getArtistKnowledge from "@/lib/supabase/getArtistKnowledge";

export async function getKnowledgeBaseContext(roomId: string): Promise<{
  knowledge: string;
  artistId: string;
}> {
  try {
    const artistId = await getArtistIdForRoom(roomId);
    if (!artistId) return { knowledge: "", artistId: "" };

    const knowledges = await getArtistKnowledge(artistId);
    if (!knowledges.length) return { knowledge: "", artistId };

    const textFiles = knowledges.filter((file) =>
      ["text/plain", "text/markdown", "application/json"].includes(file.type)
    );

    const contents = await Promise.all(
      textFiles.map(async (file) => {
        try {
          const response = await fetch(file.url);
          const content = await response.text();
          return `--- ${file.name} ---\n${content}`;
        } catch (error) {
          console.error(`Failed to fetch content for ${file.name}:`, error);
          return "";
        }
      })
    );

    return {
      knowledge: contents.filter((content) => content).join("\n\n"),
      artistId,
    };
  } catch (error) {
    console.error("[getKnowledgeBaseContext]", error);
    return { knowledge: "", artistId: "" };
  }
}

export default getKnowledgeBaseContext;
