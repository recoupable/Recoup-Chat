import { DESCRIPTION } from "./consts";
import getKnowledgeBaseContext from "./getKnowledgeBaseContext";

export async function getSystemPrompt(roomId?: string): Promise<string> {
  try {
    let systemPrompt = DESCRIPTION;
    
    if (roomId) {
      const artistKnowledge = await getKnowledgeBaseContext(roomId);
      
      if (artistKnowledge) {
        systemPrompt = `${DESCRIPTION}

-----ARTIST KNOWLEDGE BASE-----
${artistKnowledge}
-----END KNOWLEDGE BASE-----

When answering questions, incorporate relevant information from the artist knowledge base above.`;
      }
    }

    return systemPrompt;
  } catch (error) {
    console.error("[getSystemPrompt]", error);
    return DESCRIPTION;
  }
}

export default getSystemPrompt; 