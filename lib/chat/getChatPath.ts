import { isChatIntelligentUIEnabled } from "@/lib/intelligent-ui/chat/isChatIntelligentUIEnabled";

export function getChatPath(
  sessionId: string,
  chatId: string,
  catalogId?: string | string[],
): string {
  const path = `/sessions/${sessionId}/chats/${chatId}`;
  if (!isChatIntelligentUIEnabled() || catalogId === undefined) return path;
  // Retain invalid/repeated explicit input too, so a URL update cannot turn a
  // rejected catalog into an implicit artist context on the next visit.
  const query = new URLSearchParams();
  const values = Array.isArray(catalogId) ? catalogId : [catalogId];
  for (const value of values.length ? values : [""])
    query.append("catalogId", value);
  return `${path}?${query}`;
}
