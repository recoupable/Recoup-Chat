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
          description: `Retrieve data about artists, albums, episodes, tracks, audio books, fans, premium & free fan counts, and total fan count.
          Always call this tool when the question involves any of the following:
          - Artists
          - Albums
          - Episodes
          - Tracks
          - Audio books
          - Fans (including premium, free, or total counts)
          - Listening habits
          - Campaign insights
          Examples of relevant questions:
          - Who are the top artists in the campaign?
          - How many audio books are included?
          - What's the breakdown of premium vs free fans?
          - Can you provide details about the tracks in the latest campaign?`,
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
