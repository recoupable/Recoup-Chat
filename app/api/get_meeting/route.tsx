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
          content: `You are an AI trained to summarize meeting histories and answer questions about them.

            Meetings: ${JSON.stringify(context)}
            Meeting Count: ${context.length}

            Here are some example questions you might be asked:
            1. Summarize the last meeting.
            2. What problems did Willie mention during the last meeting?
            3. How many meetings have taken place?
            4. When did the last meeting occur?
            5. Who was involved in each meeting?

            Question: ${question}

            Answer: Please provide a concise and clear answer based on the provided context.
          `,
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
