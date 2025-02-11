import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  const account_id = req.nextUrl.searchParams.get("account_id");
  const report_id = req.nextUrl.searchParams.get("report_id");

  try {
    const { data: new_room, error } = await supabase
      .from("rooms")
      .insert({
        account_id,
        topic,
      })
      .select("*")
      .single();

    if (report_id)
      await supabase.from("room_reports").insert({
        room_id: new_room.id,
        report_id,
      });
    return Response.json(
      {
        new_room: {
          ...new_room,
          memories: [],
          rooms_reports: report_id ? [report_id] : [],
        },
        error,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
