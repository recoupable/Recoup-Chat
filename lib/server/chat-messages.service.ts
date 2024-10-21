import "server-only";

import getChatContext from "../chat/getChatContext";
import { AI_MODEL } from "../consts";
import { tool } from "ai";
import { z } from "zod";
import getFans from "../chat/getFans";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

export function createChatMessagesService() {
  return new ChatMessagesService();
}

class ChatMessagesService {
  constructor() {}

  async getChatSettings(question: string) {
    const context = await this.fetchRelevantContext();
    const tools = this.fetchRelevantTools(question);

    const systemMessage = `You are a helpful assistant
Here is some relevant data to help you answer:
${context}

Please use this information to provide accurate and relevant responses and don't mention the data source in your response.`;

    return {
      maxTokens: 1111,
      systemMessage,
      model: AI_MODEL,
      tools,
    };
  }

  private async fetchRelevantContext(): Promise<string> {
    try {
      const context = getChatContext();

      return context;
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return "{}";
    }
  }

  private fetchRelevantTools(question: string) {
    try {
      return {
        getCampaign: tool({
          description: `Get the artists, albums, episodes, tracks, audio Books, fans, premium & free fans count, total fans count.
          Call this if you get question which is related with listening habits, fans, artists, albums, episodes, tracks, audio book and insights`,
          parameters: z.object({}),
          execute: async () => {
            const client = getSupabaseServerAdminClient();
            const fans = await getFans(client);
            return {
              context: fans,
              question,
            };
          },
        }),
      };
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return [];
    }
  }
}
