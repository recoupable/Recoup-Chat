import { NextRequest } from "next/server";
import OpenAI from "openai";
import instructions from "@/evals/scripts/instructions.json";
import { AI_MODEL, ICONS } from "@/lib/consts";

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
          content: `**Icon Names**: ${JSON.stringify(ICONS)}\n
          **Segment Names**: ${JSON.stringify(body)}`,
        },
        {
          role: "system",
          content: `${instructions.get_segments_icons} \n Response should be in JSON format. {"data": {"segment_name1": "icon_name1", "segment_name2": "icon_name2", ...}}`,
        },
      ],
    });

    try {
      const answer = response.choices[0].message!.content!.toString();
      return Response.json(
        {
          data:
            JSON.parse(
              answer
                ?.replaceAll("\n", "")
                ?.replaceAll("json", "")
                ?.replaceAll("```", ""),
            )?.data || [],
        },
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return Response.json({ data: [], answer: response }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ data: [], error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
