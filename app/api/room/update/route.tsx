import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const room_id = req.nextUrl.searchParams.get("room_id");
  const topic = req.nextUrl.searchParams.get("topic");

  if (!room_id || !topic) {
    return Response.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // First, get the current room data to preserve the updated_at timestamp
    const { data: currentRoom, error: fetchError } = await supabase
      .from("rooms")
      .select("updated_at")
      .eq("id", room_id)
      .single();
    
    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 400 });
    }

    // Update with preserved timestamp
    const { data, error } = await supabase
      .from("rooms")
      .update({ 
        topic,
        updated_at: currentRoom.updated_at // Keep original timestamp when renaming
      })
      .eq("id", room_id)
      .select()
      .single();

    return Response.json({ room: data, error }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0; 