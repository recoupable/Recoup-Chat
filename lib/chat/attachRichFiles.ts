import { Message, CoreMessage } from "ai";
import getArtistKnowledge from "../supabase/getArtistKnowledge";
import createMessageFileAttachment from "./createFileAttachment";
import { MessageFileAttachment } from "@/types/Chat";

const findLastUserMessageIndex = (messages: Message[]): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return i;
  }
  return -1;
};

const attachRichFiles = async (
  messages: Message[],
  { artistId }: { artistId: string }
): Promise<CoreMessage[]> => {
  const lastUserIndex = findLastUserMessageIndex(messages);
  
  // Get and process artist knowledge files
  const knowledgeFiles = await getArtistKnowledge(artistId);
  const supportedFiles = knowledgeFiles.filter(
    file => file.type === "application/pdf" || file.type.startsWith("image")
  );
  
  const fileAttachments = supportedFiles
    .map(createMessageFileAttachment)
    .filter((attachment): attachment is MessageFileAttachment => attachment !== null);

  // Transform messages, adding attachments to the user message
  // Ref. https://ai-sdk.dev/providers/ai-sdk-providers/anthropic#pdf-support
  return messages.map((message, idx) => {
    if (idx === lastUserIndex && message.role === "user") {
      return {
        role: "user" as const,
        content: [
          { type: "text" as const, text: message.content },
          ...fileAttachments,
        ],
      };
    }
    
    return {
      role: message.role,
      content: message.content,
    } as CoreMessage;
  });
};

export default attachRichFiles;
