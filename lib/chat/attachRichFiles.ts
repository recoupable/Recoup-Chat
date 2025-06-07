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
  console.log("knowledges", knowledges);
  const files = knowledges.filter((file) => file.type === "application/pdf" || file.type.startsWith("image"));
  const fileStructure = files
    .filter(
      (file) => file.type === "application/pdf" || file.type.startsWith("image")
    )
    .map((file) => {
      if (file.type === "application/pdf") {
        return {
          type: "file" as const,
          data: new URL(file.url),
          mimeType: file.type,
        };
      } else if (file.type.includes("image")) {
        return {
          type: "image" as const,
          image: file.url,
        };
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  console.log("fileStructure", fileStructure);

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
