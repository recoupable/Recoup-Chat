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
    
    1. Due to Apple's policy, do not collect Apple Music emails. No recommendations or insights are needed.
      For example: "Due to Apple's policy, we do not collect Apple Music emails."

    2. The guidelines below outline responses based on question type:
      - Count Queries: Respond with only the number, NOTHING ELSE.
      - Artists, Albums, Episodes, Playlists, Audio Books, Tracks, Shows.: Provide only relevant information.
      - Country Distribution Fans: Format as [country name]: [fan count] with <li> tags.
      - Listening Habits (4 Sentences):
        a. Overview: Summarize listening trends, including genres, artists, content types, countries, cities, and segments.
        b. Content Breakdown: Highlight popular items and standout artists.
        c. Engagement Metrics: Report key statistics and identify top performers.
    
    3.Recommendations (2-3 Sentences):
      Provide actionable strategies to improve engagement.
    
    4. Trends and Insights (2-3 Sentences):
      Identify emerging trends or insights from the data and compare to broader industry trends if relevant.

    Ensure your answer is data-driven, insightful, and provides clear value for understanding and acting on the fan base's behavior.
    ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}`;

  return "";
};

export default toolSystemMessage;
