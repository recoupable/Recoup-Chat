import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = body.question;

  try {
    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: `Provide a brief title (more formal, no more than 15 characters!!!) that reflects the key elements of the given context.
          Highlight key words such as segment name…
          
          Context: ${question}`,
        },
      ],
      store: true,
    });

    const title = response.choices[0].message!.content!.toString();
    return Response.json({
      message: "success",
      title,
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
