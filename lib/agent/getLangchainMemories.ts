import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import queryMemories from "@/lib/supabase/queryMemories";

/**
 * Retrieves memories from Supabase and converts them to LangChain message format
 * @param roomId The room ID to get memories for
 * @param limit Maximum number of memories to retrieve (default: 100)
 * @returns Array of LangChain BaseMessage objects in chronological order
 */
export default async function getLangchainMemories(roomId: string, limit = 100): Promise<BaseMessage[]> {
  try {
    const { data, error } = await queryMemories(roomId, { ascending: false, limit });
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    const langChainMessages = data.map((memory) => {
      const content = memory.content;
      
      if (content.role === "user") {
        return new HumanMessage(content.content);
      } else if (content.role === "assistant") {
        return new AIMessage(content.content);
      }
      
      return new HumanMessage(content.content);
    });
    
    // Return messages in chronological order (oldest first)
    return langChainMessages.reverse();
  } catch (error) {
    console.error("Error in getLangchainMemories:", error);
    return [];
  }
} 