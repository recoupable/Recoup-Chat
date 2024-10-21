import "server-only";

import getChatContext from "../chat/getChatContext";
import { AI_MODEL } from "../consts";
import { tool } from "ai";
import { z } from "zod";
import getFans from "../chat/getFans";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NOTES } from "../chat/const";

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
          description: `IMPORTANT: Always call this tool for ANY question related to the following topics:
          1. Artists
          2. Albums
          3. Episodes
          4. Tracks
          5. Audio books
          6. Shows
          7. Fans (including premium, free, or total counts)
          8. Listening habits (from any platform, including Spotify and Apple)
          9. Campaign insights or data
          10. Any comparison or analysis of music consumption or fan behavior

          Do NOT attempt to answer questions on these topics without calling this tool first.

          Example questions that MUST trigger this tool:
          - "What are the listening habits from Spotify and Apple?"
          - "How many fans does the artist have?"
          - "What insights can we draw from the latest campaign?"
          - "How many premium subscribers are there?"

          When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
          parameters: z.object({
            fanName: z
              .string()
              .optional()
              .describe("The fan name to get the information. Optional."),
          }),
          execute: async ({ fanName }) => {
            const client = getSupabaseServerAdminClient();
            const fans = await getFans(client, fanName || "");
            return {
              context: fans,
              question,
              fanName: fanName || "",
            };
          },
        }),
        getMeetingNotes: tool({
          description: `
          IMPORTANT: Always call this tool for ANY question related to meeting:
          Do NOT attempt to answer questions on these topics without calling this tool first.

          For example: 
            summarize the last meeting.
            what are the problems willie mentioned during the last meeting?
            how many meetings are there?
            when did this meeting take place?
            who was involved in every single meeting?`,
          parameters: z.object({}),
          execute: async ({}) => {
            return {
              context: NOTES,
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
