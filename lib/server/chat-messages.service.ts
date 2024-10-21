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

  async getChatSettings() {
    const context = await this.fetchRelevantContext();
    const tools = this.fetchRelevantTools();

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

  private fetchRelevantTools() {
    try {
      return {
        getCampaign: tool({
          description:
            "Get the artists, playlists, albums, episodes, audio books, shows, tracks that are related to fans. Call this whenever you need to know the listening habits, fans count, insights. For example: 'what are the listening habits from Luh Tyler's latest campaign?', 'how many fans are included in the campaign?', 'what insights could we. draw from our latest campaign?'",
          parameters: z.object({}),
          execute: async () => {
            const client = getSupabaseServerAdminClient();
            const fans = getFans(client);
            return fans;
          },
        }),
      };
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return [];
    }
  }
}
