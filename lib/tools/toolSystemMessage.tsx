// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const toolSystemMessage = (context: any, question: any, toolName: string) => {
  if (toolName === "getArtistAnalysis")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}

    Context:
    - You have access to TikTok trends data concerning various artists.
    - Your task is to analyze this data to generate insights about the musician.

    Instructions:
    1. Review the TikTok trends data provided.
    2. Identify key patterns or themes related to the artist's content.
    3. Provide an analysis that includes:
      - The artist's most viral content and why it was successful.
      - Recommendations for future content strategies based on current trends.
      - Insights on audience engagement and demographics.

    Make sure to provide actionable insights that the artist can use to enhance their presence on TikTok.
    `;
  if (toolName === "getCampaign")
    return `
    Context: ${JSON.stringify(context)}
    Question: ${question}

    Analyze the provided context and answer the question comprehensively. Follow these guidelines:

    1. Specific Focus:
      - If the question asks for a count (e.g., total fans, premium users), respond with just the number.
      - If the question asks for only artists, albums, episodes, playlists, audio books, tracks, shows, respond with only their information.
      - If the question asks for listening habits:
        ** Overview:
          a. Provide a broad summary of listening trends.
          b. Include details on popular genres, artists, content types and segment.
          c. Mention specific fan names, countries, cities and segment.
        ** Content Breakdown:
          a. Highlight popular playlists, albums, episodes, audiobooks, shows, and tracks.
          b. Identify standout artists and their impact on the fanbase.
        ** Engagement Metrics:
          a. Report on key statistics like total fans, plays, or other relevant metrics.
          b. Identify top performers or outliers in the data.

    2. Recommendations:
      - Suggest 2-3 actionable strategies to improve engagement based on the data.
      - Example: "To boost engagement, consider launching a personalized playlist campaign featuring top artists from each user's listening history."

    3. Trends and Insights:
      - Identify any emerging trends or unique insights from the data.
      - Compare to broader industry trends if relevant.

    Ensure your answer is data-driven, insightful, and provides clear value for understanding and acting on the fan base's behavior.
    Respond with a plain text string. Do not include any markdown formatting, JSON structure, or special characters. Avoid greetings, closings, or any meta-commentary about the response format.`;

  return "";
};

export default toolSystemMessage;
