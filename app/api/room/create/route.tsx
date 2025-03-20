import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  const account_id = req.nextUrl.searchParams.get("account_id");
  const report_id = req.nextUrl.searchParams.get("report_id");
  const artist_id = req.nextUrl.searchParams.get("artist_id");

  if (!topic || !account_id) {
    return Response.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const result = await createRoomWithReport({
      account_id,
      topic,
      report_id: report_id || undefined,
      artist_id: artist_id || undefined,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in /api/room/create:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create room";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
