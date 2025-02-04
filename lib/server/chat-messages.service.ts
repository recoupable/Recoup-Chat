import "server-only";

import { AI_MODEL, HTML_RESPONSE_FORMAT_INSTRUCTIONS } from "../consts";
// import createArtist from "../tools/createArtist";
// import getArtists from "../tools/getArtists";
import analyzeArtist from "../tools/analyzeArtist";
// import createCampaign from "../tools/createCampaign";
// import getCampaigns from "../tools/getCampaigns";
// import updateArtistInfo from "../tools/updateArtistInfo";
// import getScoreInfo from "../tools/getScoreInfo";
import getBaseCampaign from "../chat/getBaseCampaign";
// import getVideosInfo from "../tools/getVideosInfo";
// import getSegmentsReport from "../tools/getSegmentsReport";
// import getPitchReport from "../tools/getPitchReport";
// import getInstrumentalStyleSuggestions from "../tools/getInstrumentalStyleSuggestions";

export function createChatMessagesService() {
  return new ChatMessagesService();
}

class ChatMessagesService {
  constructor() {}

  async getChatSettings(
    question: string,
    email: string,
    artistId: string,
    context: string,
  ) {
    const tools = this.fetchRelevantTools(question);
    const systemMessage = `
*****
[Context]: ${context}
*****
[Question]: ${question}
*****
[Instruction]: 
*****
Do not include descriptive text before or after your answer. Answer the question only based on given fans data.
Please try to provide accurate information about fans, including their names.
${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
`;

    return {
      maxTokens: 1111,
      systemMessage,
      model: AI_MODEL,
      tools,
    };
  }

  private async fetchRelevantContext(
    email: string,
    artistId: string,
  ): Promise<string> {
    try {
      const data = await getBaseCampaign(artistId, email);
      const context = JSON.stringify(data);
      return context;
    } catch (error) {
      console.error("Error reading or parsing JSON files:", error);
      return "{}";
    }
  }

  private fetchRelevantTools(
    question: string,
    // email: string,
    // artistId: string,
  ) {
    return [
      // getVideosInfo(question),
      // getScoreInfo(question),
      // createArtist(question),
      // getArtists(question, email),
      analyzeArtist(question),
      // createCampaign(question, email),
      // getCampaigns(question, email, artistId),
      // updateArtistInfo(question),
      // getSegmentsReport(question),
      // getPitchReport(question),
      // getInstrumentalStyleSuggestions(question),
    ];
  }
}
