import getArtistKnowledge from "@/lib/supabase/getArtistKnowledge";

export async function getKnowledgeBaseContext(
  artistId: string
): Promise<string> {
  try {
    if (!artistId) return "";

    const knowledges = await getArtistKnowledge(artistId);
    if (!knowledges.length) return "";

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

    return contents.filter((content) => content).join("\n\n");
  } catch (error) {
    console.error("[getKnowledgeBaseContext]", error);
    return "";
  }
}

export default getKnowledgeBaseContext;
