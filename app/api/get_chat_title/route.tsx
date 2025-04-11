import { NextRequest } from "next/server";
import { generateChatTitle } from "@/lib/chat/generateChatTitle";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = body.question;

  try {
    const title = await generateChatTitle(question);

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
