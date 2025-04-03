import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const account_id = req.nextUrl.searchParams.get("account_id");

  try {
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("*, memories(*), room_reports(report_id)")
      .eq("account_id", account_id)
      .order('updated_at', { ascending: false });

    return Response.json({ rooms: rooms || [], error }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
