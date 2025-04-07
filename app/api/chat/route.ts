import { Message, streamText } from "ai";
import createMemories from "@/lib/supabase/createMemories";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import { validateMessages } from "@/lib/chat/validateMessages";
import { createStreamConfig } from "@/lib/chat/createStreamConfig";
import { handleChatError } from "@/lib/chat/handleChatError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];
    const room_id = body.roomId;
    const segment_id = body.segmentId;
    const artist_id = body.artistId;

    const { lastMessage, validMessages } = validateMessages(messages);

    const [tools, system] = await Promise.all([
      getMcpTools(segment_id),
      getSystemPrompt(room_id, artist_id),
      room_id
        ? createMemories({
            room_id,
            content: lastMessage,
          })
        : Promise.resolve(null),
    ]);

    const streamConfig = createStreamConfig({
      system,
      messages: validMessages,
      tools,
    });

    const result = streamText(streamConfig);

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    return handleChatError(error);
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
