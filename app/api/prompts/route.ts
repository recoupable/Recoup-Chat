import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest) {
  const answer = req.nextUrl.searchParams.get("answer");

  try {
    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: `Based on the conversation context, generate helpful follow-up questions that encourage deeper exploration and analysis of the provided data. 
          - Questions should be framed to help guide the user to actionable insights.
          - Utilize the existing data context to craft relevant and engaging questions.
          - Ensure that questions are forward-thinking, aimed at helping the user make informed decisions or identify key trends.
          - Keep questions to 10 words or less.
          - Dumb it down to a 7th grade reading level.
          - Limit number of questions to 4 max.

          For example:
          "What should we do with this data?" - Too broad.
          "How can we use data from top fans to boost engagement?" - More specific and action-oriented.
          
          Answer:
          ${answer}
          `,
        },
        {
          role: "system",
          content: `Let's get response with only this json format. {"data": [string]}`,
        },
      ],
    });

    const questions = response.choices[0].message!.content!.toString();
    return Response.json({
      message: "success",
      questions: JSON.parse(questions).data,
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
