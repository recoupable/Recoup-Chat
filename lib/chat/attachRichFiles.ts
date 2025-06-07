import { Message, CoreMessage } from "ai";
import getArtistKnowledge from "../supabase/getArtistKnowledge";

type FileAttachment = {
  type: "file";
  data: URL;
  mimeType: string;
} | {
  type: "image";
  image: string;
};

const createFileAttachment = (file: { url: string; type: string }): FileAttachment | null => {
  if (file.type === "application/pdf") {
    return {
      type: "file" as const,
      data: new URL(file.url),
      mimeType: file.type,
    };
  }
  
  if (file.type.startsWith("image")) {
    return {
      type: "image" as const,
      image: file.url,
    };
  }
  
  return null;
};

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
    .map(createFileAttachment)
    .filter((attachment): attachment is FileAttachment => attachment !== null);

  // Transform messages, adding attachments to the last user message
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
