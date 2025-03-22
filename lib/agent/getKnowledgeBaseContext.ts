import supabase from "@/lib/supabase/serverClient";

interface KnowledgeBaseEntry {
  url: string;
  name: string;
  type: string;
  content?: string;
}

export async function getKnowledgeBaseContext(roomId: string): Promise<string> {
  try {
    const { data: room } = await supabase
      .from("rooms")
      .select("artist_id")
      .eq("id", roomId)
      .single();
    
    if (!room?.artist_id) return "";

    const { data: accountInfo } = await supabase
      .from("account_info")
      .select("knowledges")
      .eq("account_id", room.artist_id)
      .single();
    
    if (!accountInfo?.knowledges?.length) return "";
    
    const textFiles = (accountInfo.knowledges as KnowledgeBaseEntry[]).filter(file => 
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