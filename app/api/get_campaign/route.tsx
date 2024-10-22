import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const context = body.context;
  const question = body.question;

  try {
    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: `Context: ${JSON.stringify(context)}
          Question: ${question}

          Analyze the provided context and answer the question comprehensively. Follow these guidelines:

          1. Listening Habits Overview:
            - Provide a broad summary of listening trends.
            - Include details on popular genres, artists, and content types.
            - Mention specific fan names, countries, and cities when relevant.

          2. Content Breakdown:
            - Highlight popular playlists, albums, episodes, audiobooks, shows, and tracks.
            - Identify standout artists and their impact on the fanbase.

          3. Specific Focus:
            - If the question asks for a count (e.g., total fans, premium users), respond with just the number.

          4. User Segmentation:
            - Distinguish between premium and free users if applicable.

          5. Engagement Metrics:
            - Report on key statistics like total fans, plays, or other relevant metrics.
            - Identify top performers or outliers in the data.

          6. Recommendations:
            - Suggest 2-3 actionable strategies to improve engagement based on the data.
            - Example: "To boost engagement, consider launching a personalized playlist campaign featuring top artists from each user's listening history."

          7. Trends and Insights:
            - Identify any emerging trends or unique insights from the data.
            - Compare to broader industry trends if relevant.

          Ensure your answer is data-driven, insightful, and provides clear value for understanding and acting on the fan base's behavior.`,
        },
        {
          role: "system",
          content: `Respond with a plain text string. Do not include any markdown formatting, JSON structure, or special characters. Avoid greetings, closings, or any meta-commentary about the response format.`,
        },
      ],
    });

    const answer = response.choices[0].message!.content!.toString();

    return Response.json({
      message: "success",
      answer,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
