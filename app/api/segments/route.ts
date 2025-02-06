import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import instructions from "@/evals/scripts/instructions.json";
import { AI_MODEL } from "@/lib/consts";
import { getArtistSegments } from "@/lib/supabase/getArtistSegments";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistIds = searchParams.getAll("artistId");

  if (!artistIds.length) {
    return NextResponse.json(
      { error: "At least one Artist ID is required" },
      { status: 400 }
    );
  }

  try {
    const segments = await getArtistSegments(artistIds);
    return NextResponse.json(segments);
  } catch (error) {
    console.error("Error fetching segments:", error);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

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
          content: `Context: ${JSON.stringify(body)}`,
        },
        {
          role: "system",
          content: `${instructions.get_fan_segments} \n Response should be in JSON format. {"data": [{ "string": number }, { "string": number }]}.`,
        },
      ],
    });

    try {
      const answer = response.choices[0].message!.content!.toString();
      return NextResponse.json(
        {
          data:
            JSON.parse(
              answer
                ?.replaceAll("\n", "")
                ?.replaceAll("json", "")
                ?.replaceAll("```", "")
            )?.data || [],
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ data: [], answer: response }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: [], error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
