import {
  AI_MODEL,
  FULL_REPORT_NOTE,
  HTML_RESPONSE_FORMAT_INSTRUCTIONS,
} from "@/lib/consts";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import instructions from "@/evals/scripts/instructions.json";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1111,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Context: ${JSON.stringify(body)}
          Question: Please, create a tiktok fan segment report.`,
        },
        {
          role: "system",
          content: `${instructions.get_segements_report}
          ${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
          NOTE: ${FULL_REPORT_NOTE}`,
        },
      ],
      store: true,
    });

    const content = response.choices[0].message!.content!.toString();
    return Response.json({
      message: "success",
      content,
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
