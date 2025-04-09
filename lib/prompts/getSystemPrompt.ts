import { SYSTEM_PROMPT } from "@/lib/consts";
import getKnowledgeBaseContext from "@/lib/agent/getKnowledgeBaseContext";

export async function getSystemPrompt(roomId?: string): Promise<string> {
  let systemPrompt = SYSTEM_PROMPT;

  if (roomId) {
    const { knowledge, artistId } = await getKnowledgeBaseContext(roomId);
    if (knowledge) {
      systemPrompt = `${SYSTEM_PROMPT}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----
 The active artist_account_id is ${artistId}`;
    }
  }

  return systemPrompt;
}

export default getSystemPrompt;
