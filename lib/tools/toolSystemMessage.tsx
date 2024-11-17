import instructions from "@/evals/scripts/instructions.json";

import { HTML_RESPONSE_FORMAT_INSTRUCTIONS } from "../consts";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const toolSystemMessage = (context: any, question: any, toolName: string) => {
  if (toolName === "getArtistAnalysis")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}

    Reply should be 4 sentences or less with actionable insights that focus on creating new campaigns, such as how many TikTok followers you have, how many likes you have, your music style, how you connect with your audience, especially when it comes to your latest single, and what games you can play while listening to music.
    `;
  if (toolName === "getCampaign")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}
    ${instructions.get_campaign}
    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}`;

  return "";
};

export default toolSystemMessage;
