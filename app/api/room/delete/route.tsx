import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const room_id = req.nextUrl.searchParams.get("room_id");

  if (!room_id) {
    return Response.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", room_id);

    return Response.json({ success: !error, error }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0; 