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
    NOTE: Due to Apple's policy, Do not collect apple music emails.
    Analyze the provided context and answer the question comprehensively. Follow these guidelines:

    1. Specific Focus:
      - If the question asks for a count, respond with only the number, NOTHING ELSE(like list and etc)!!!!. 
      - If the question asks for only artists, albums, episodes, playlists, audio books, tracks, shows, respond with only their information.
      - If the question asks for listening habits(4 Sentences):
        ** Overview:
          a. Provide a broad summary of listening trends.
          b. Include details on popular genres, artists, content types, names, countries, cities and segment.
        ** Content Breakdown:
          a. Highlight popular playlists, albums, episodes, audiobooks, shows, and tracks.
          b. Identify standout artists and their impact on the fanbase.
        ** Engagement Metrics:
          a. Report on key statistics like total fans, plays, or other relevant metrics.
          b. Identify top performers or outliers in the data.

    2. Recommendations(2-3 Sentences):
      - Actionable strategies to improve engagement based on the data.
      - Example: "To boost engagement, consider launching a personalized playlist campaign featuring top artists from each user's listening history."

    3. Trends and Insights(2-3 Sentences):
      - Identify any emerging trends or unique insights from the data.
      - Compare to broader industry trends if relevant.

    
    Ensure your answer is data-driven, insightful, and provides clear value for understanding and acting on the fan base's behavior.
    Please provide a wide range of HTML formats with embedded HTML tags such as <div>, <p>, <ul>, <li>, and <span>, along with CSS styles including font size, margin, and padding. 
    Please do not include any color styles. The font size for paragraphs should be 14px with left padding 8px & top padding 4px for indentation, while the font size for heading tags (h1 to h6) should be 16px and bold.
    Make sure to present the HTML response as plain HTML without any enclosing code markers or delimiters.`;

  return "";
};

export default toolSystemMessage;
