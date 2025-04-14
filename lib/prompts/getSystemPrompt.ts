import { SYSTEM_PROMPT } from "@/lib/consts";
import getKnowledgeBaseContext from "@/lib/agent/getKnowledgeBaseContext";
import getArtistIdForRoom from "../supabase/getArtistIdForRoom";

export async function getSystemPrompt({
  roomId,
  artistId,
  email,
  conversationName,
}: {
  roomId?: string;
  artistId?: string;
  email?: string;
  conversationName?: string;
}): Promise<string> {
  const resolvedArtistId = artistId || (await getArtistIdForRoom(roomId || ""));

  let systemPrompt = `${SYSTEM_PROMPT} 
  The active artist_account_id is ${resolvedArtistId}. 
  The active_account_email is ${email || "Unknown"}. 
  The active_conversation_id is ${roomId || "No ID"}.
  The active_conversation_name is ${conversationName || "No Chat Name"}.`;

  const knowledge = await getKnowledgeBaseContext(resolvedArtistId || "");
  if (knowledge) {
    systemPrompt = `${systemPrompt}
-----ARTIST KNOWLEDGE BASE-----
${knowledge}
-----END KNOWLEDGE BASE-----`;
  }

  return systemPrompt;
}

export default getSystemPrompt;
