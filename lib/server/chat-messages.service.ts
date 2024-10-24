import "server-only";

import getChatContext from "../chat/getChatContext";
import { AI_MODEL } from "../consts";
import campaignTool from "../tools/campaignTool";

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
        getCampaign: campaignTool(question),
      };
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return [];
    }
  }
}
