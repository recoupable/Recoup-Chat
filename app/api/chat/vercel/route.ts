import { SYSTEM_PROMPT } from "@/lib/consts";
import { myProvider } from "@/lib/models";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { validateMessages } from "@/lib/chat/validateMessages";

export async function POST(request: NextRequest) {
  const {
    messages,
    isReasoningEnabled,
    roomId,
  }: {
    messages: Array<Message>;
    isReasoningEnabled: boolean;
    roomId?: string;
  } = await request.json();
  const selectedModelId = "sonnet-3.7";
  const system = SYSTEM_PROMPT;

  if (roomId) {
    const { lastMessage } = validateMessages(messages);
    await createMemories({
      room_id: roomId,
      content: lastMessage,
    });
  }

  const tools = await getMcpTools();

  const stream = streamText({
    system,
    tools,
    providerOptions:
      selectedModelId === "sonnet-3.7" && isReasoningEnabled === false
        ? {
            anthropic: {
              thinking: {
                type: "disabled",
                budgetTokens: 12000,
              },
            },
          }
        : {},
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages,
    maxSteps: 11,
    toolCallStreaming: true,
  });

  return stream.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: () => {
      return `An error occurred, please try again!`;
    },
  });
}
