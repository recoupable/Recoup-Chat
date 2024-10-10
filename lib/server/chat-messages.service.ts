import "server-only";

import getChatContext from "../chat/getChatContext";
import { AI_MODEL } from "../consts";
export function createChatMessagesService() {
  return new ChatMessagesService();
}

class ChatMessagesService {
  constructor() {}

  async getChatSettings(message: string) {
    const context = await this.fetchRelevantContext(message);

    const systemMessage = `You are a helpful assistant
Here is some relevant data to help you answer:
${context}

Please use this information to provide accurate and relevant responses and don't mention the data source in your response.`;

    return {
      maxTokens: 1111,
      systemMessage,
      model: AI_MODEL,
      temperature: 0.7,
    };
  }

  private async fetchRelevantContext(message: string): Promise<string> {
    try {
      const isHabitQuestion = message.includes("habit");
      const context = getChatContext(isHabitQuestion);

      return context;
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return "{}";
    }
  }
}
