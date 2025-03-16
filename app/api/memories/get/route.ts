import supabase from "@/lib/supabase/serverClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get("roomId");
  const artistId = req.nextUrl.searchParams.get("artistId");

  try {
    // If artistId is provided, verify room belongs to this artist
    if (artistId) {
      // First, check if the room belongs to the specified artist
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("id")
        .eq("id", roomId)
        .eq("artist_id", artistId)
        .single();

      // If no matching room was found, return empty data
      if (roomError || !roomData) {
        console.log(`[memories/get] Room ${roomId} not found for artist ${artistId}`);
        return Response.json({ data: [], error: null }, { status: 200 });
      }
    }

    // Fetch memories for the room
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("room_id", roomId);

    return Response.json({ data, error }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
