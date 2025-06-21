import { myProvider } from "@/lib/models";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import createMemories from "@/lib/supabase/createMemories";
import {
  appendResponseMessages,
  createDataStreamResponse,
  Message,
  smoothStream,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { validateMessages } from "@/lib/chat/validateMessages";
import getSystemPrompt from "@/lib/prompts/getSystemPrompt";
import getRoom from "@/lib/supabase/getRoom";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import generateUUID from "@/lib/generateUUID";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";
import { sendNewConversationNotification } from "@/lib/telegram/sendNewConversationNotification";
import filterMessageContentForMemories from "@/lib/messages/filterMessageContentForMemories";
import attachRichFiles from "@/lib/chat/attachRichFiles";
import { handleChatError } from "@/lib/errors/handleError";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    messages,
    roomId,
    artistId,
    accountId,
  }: {
    messages: Array<Message>;
    roomId: string;
    artistId?: string;
    accountId: string;
    email?: string;
  } = body;
  let email = body.email;

  // Build error context once (DRY principle)
  const errorContext = {
    email,
    roomId,
    accountId,
    messages,
  };

  try {
    if (!email && accountId) {
      const emails = await getAccountEmails(accountId);
      if (emails.length > 0 && emails[0].email) {
        email = emails[0].email;
        errorContext.email = email; // Update context with resolved email
      }
    }

    const selectedModelId = "sonnet-3.7";

    const [room, tools] = await Promise.all([getRoom(roomId), getMcpTools()]);
    let conversationName = room?.topic;

    if (!room) {
      conversationName = await generateChatTitle(messages[0].content);

      await Promise.all([
        createRoomWithReport({
          account_id: accountId,
          topic: conversationName,
          artist_id: artistId || undefined,
          chat_id: roomId || undefined,
        }),
        sendNewConversationNotification({
          accountId,
          email,
          conversationId: roomId,
          topic: conversationName,
          firstMessage: messages[0].content,
        }),
      ]);
    }

    const { lastMessage } = validateMessages(messages);

    // Attach files like PDFs and images
    const messagesWithRichFiles = await attachRichFiles(messages, {
      artistId: artistId as string,
    });

    const [, system] = await Promise.all([
      createMemories({
        id: lastMessage.id,
        room_id: roomId,
        content: filterMessageContentForMemories(lastMessage),
      }),
      getSystemPrompt({
        roomId,
        artistId,
        accountId,
        email,
        conversationName,
      }),
    ]);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedModelId),
          system,
          messages: messagesWithRichFiles,
          maxSteps: 111,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools,
          onFinish: async ({ response }) => {
            try {
              const [, assistantMessage] = appendResponseMessages({
                messages: [lastMessage],
                responseMessages: response.messages,
              });
              await createMemories({
                id: assistantMessage.id,
                room_id: roomId,
                content: filterMessageContentForMemories(assistantMessage),
              });
            } catch (error) {
              // Simplified error handling - DRY principle
              handleChatError(error, errorContext, 'completion');
              console.error("Failed to save chat", error);
            }
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error: unknown) => {
        // Simplified error handling - DRY principle
        handleChatError(error, errorContext, 'streaming');
        console.error("Error in chat API:", error);
        return JSON.stringify({ error: "Chat stream error" });
      },
    });
  } catch (error) {
    // Simplified error handling - DRY principle
    handleChatError(error, errorContext, 'global');
    console.error("Global error in chat API:", error);
    return new Response(JSON.stringify({ error: "Chat processing error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
