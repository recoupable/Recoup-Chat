import { AI_MODEL } from "@/lib/consts";
import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { LanguageModelV1, streamText } from "ai";
import toolSystemMessage from "@/lib/tools/toolSystemMessage";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const context = body.context;
  const question = body.question;
  const toolName = body.toolName;

  try {
    const systemMessage = toolSystemMessage(context, question, toolName);

    const result = await streamText({
      model: openai(AI_MODEL) as LanguageModelV1,
      system: systemMessage,
      maxTokens: 1111,
      temperature: 0.7,
      messages: [],
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
