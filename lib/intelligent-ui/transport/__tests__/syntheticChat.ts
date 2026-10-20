import { Chat } from "@ai-sdk/react";
import type { ChatInit, UIMessage } from "ai";
import { createWorkflowChatTransport } from "@/lib/chat/createWorkflowChatTransport";

export function syntheticChat(
  options: Pick<ChatInit<UIMessage>, "messages" | "onData"> = {},
) {
  return new Chat({
    id: "synthetic-chat",
    transport: createWorkflowChatTransport({
      baseUrl: "https://recoup.invalid",
      getIds: () => ({
        chatId: "synthetic-chat",
        sessionId: "synthetic-session",
      }),
      getAccessToken: async () => "synthetic-token",
    }),
    ...options,
  });
}
