import instructions from "@/evals/scripts/instructions.json";

import { HTML_RESPONSE_FORMAT_INSTRUCTIONS } from "../consts";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const toolSystemMessage = (context: any, question: any, toolName: string) => {
  if (toolName === "getArtistAnalysis")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}
    ${instructions.get_tiktok_analysis}
    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
    `;
  if (toolName === "getVideosInfo")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}
    ${instructions.get_tiktok_video_comments}
    `;
  if (toolName === "getScoreInfo")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}
    ${instructions.get_campaign_score}
    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}`;

  if (toolName === "getSegmentsReport")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}
    ${instructions.get_segments_report_summary}
    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}`;

  return "";
};

export default toolSystemMessage;
