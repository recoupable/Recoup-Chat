import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import supabase from "./serverClient";

/**
 * Retrieves previous messages from the database for a specific chat room
 * and converts them to LangChain message format for the agent
 * 
 * @param roomId The ID of the chat room
 * @param limit Maximum number of messages to retrieve (default: 10)
 * @returns Array of LangChain messages in chronological order
 */
export async function getPreviousMessages(roomId: string, limit = 10): Promise<BaseMessage[]> {
  try {
    console.log("[getPreviousMessages] Retrieving messages for room:", roomId);
    
    // Retrieve messages from the database
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("room_id", roomId)
      .order("updated_at", { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error("[getPreviousMessages] Error retrieving messages:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("[getPreviousMessages] No messages found for room:", roomId);
      return [];
    }
    
    console.log("[getPreviousMessages] Retrieved messages:", {
      count: data.length,
      firstMessage: data[0],
      lastMessage: data[data.length - 1],
    });
    
    // Convert to LangChain message format
    const langChainMessages: BaseMessage[] = data.map((memory) => {
      const content = memory.content;
      
      // Check if the message is from the user or the assistant
      if (content.role === "user") {
        return new HumanMessage(content.content);
      } else if (content.role === "assistant") {
        return new AIMessage(content.content);
      }
      
      // Default to HumanMessage if role is unknown
      return new HumanMessage(content.content);
    });
    
    console.log("[getPreviousMessages] Converted to LangChain format:", {
      count: langChainMessages.length,
    });
    
    return langChainMessages;
  } catch (error) {
    console.error("[getPreviousMessages] Unexpected error:", error);
    return [];
  }
} 