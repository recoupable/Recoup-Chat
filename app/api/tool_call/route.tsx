import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { LanguageModelV1, streamText } from "ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const context = body.context;
  const question = body.question;

  try {
    const systemMessage = `
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

    const result = await streamText({
      model: openai(AI_MODEL) as LanguageModelV1,
      system: systemMessage,
      maxTokens: 1111,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
