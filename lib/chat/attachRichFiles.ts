import { Message } from "ai";
import { CoreMessage } from "ai";
import getArtistKnowledge from "../supabase/getArtistKnowledge";

const attachRichFiles = async (
  messages: Message[],
  { artistId }: { artistId: string }
): Promise<CoreMessage[]> => {
  // Find the last user message index
  const lastUserIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return i;
    }
    return -1;
  })();

  const knowledges = await getArtistKnowledge(artistId);
  const files = knowledges.filter((file) => file.type === "application/pdf");
  const fileStructure = files
    .filter((file) => file.type === "application/pdf")
    .map((file) => ({
      type: "file" as const,
      data: new URL(file.url),
      mimeType: file.type,
    }));

  return messages.map((message, idx) => {
    if (idx === lastUserIndex && message.role === "user") {
      // Modify the last user message as needed (example: add a flag)
      return {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: message.content,
          },
          ...fileStructure,
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
