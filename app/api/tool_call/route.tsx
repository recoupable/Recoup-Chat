import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest) {
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
          Answer: ????

          Based on provided data, let me know the only answer.
          `,
        },
        {
          role: "system",
          content: `Let's just get a response without any greeting or useless text in string format.`,
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
