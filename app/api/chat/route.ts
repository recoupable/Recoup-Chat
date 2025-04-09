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
    const artistId = body.artistId;
    const { lastMessage, validMessages } = validateMessages(messages);

    if (room_id) {
      await createMemories({
        room_id,
        content: lastMessage,
      });
    }

    const tools = await getMcpTools(segment_id);
    const system = await getSystemPrompt({ roomId: room_id, artistId });

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
