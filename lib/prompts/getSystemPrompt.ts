import { SYSTEM_PROMPT } from "@/lib/consts";
import getKnowledgeBaseContext from "@/lib/agent/getKnowledgeBaseContext";
import getArtistIdForRoom from "../supabase/getArtistIdForRoom";

export async function getSystemPrompt({
  roomId,
  artistId,
}: {
  roomId?: string;
  artistId?: string;
}): Promise<string> {
  let systemPrompt = SYSTEM_PROMPT;

  if (roomId) {
    const resolvedArtistId = artistId || (await getArtistIdForRoom(roomId));
    const knowledge = await getKnowledgeBaseContext(resolvedArtistId || "");
    if (knowledge) {
      systemPrompt = `${SYSTEM_PROMPT}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----
 The active artist_account_id is ${resolvedArtistId}`;
    }
  }

  return systemPrompt;
}

export default getSystemPrompt;
