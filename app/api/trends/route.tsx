import getTikTokContext from "@/lib/apify/getTikTokContext";
import getTiktokTrends from "@/lib/apify/getTiktokTrends";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle");

  try {
    const trends = await getTiktokTrends(handle as string);
    const trendsContext = getTikTokContext(trends);
    return Response.json({
      success: true,
      trends: trendsContext,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}
