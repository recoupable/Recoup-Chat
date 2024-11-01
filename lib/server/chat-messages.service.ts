import "server-only";

import getChatContext from "../chat/getChatContext";
import { AI_MODEL } from "../consts";
import getCampaign from "../tools/getCampaign";
import createArtist from "../tools/createArtist";
import getArtists from "../tools/getArtists";
import createCampaign from "../tools/createCampaign";

export function createChatMessagesService() {
  return new ChatMessagesService();
}

class ChatMessagesService {
  constructor() {}

  async getChatSettings(question: string, email: string) {
    const context = await this.fetchRelevantContext();
    const tools = this.fetchRelevantTools(question, email);

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

  private fetchRelevantTools(question: string, email: string) {
    try {
      return {
        getCampaign: getCampaign(question),
        createArtist: createArtist(question, email),
        getArtists: getArtists(question, email),
        createCampaign: createCampaign(question, email),
      };
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return [];
    }
  }
}
