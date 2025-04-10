import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/serverClient";

export async function POST(req: NextRequest) {
  try {
    const { roomId, newName } = await req.json();

    if (!roomId || !newName) {
      return Response.json(
        { message: "Missing required parameters: roomId and newName" },
        { status: 400 }
      );
    }

    // Validate the new name
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 50) {
      return Response.json(
        { message: "Name must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    // Update the room name in the database
    const { data, error } = await supabase
      .from("rooms")
      .update({ topic: trimmedName })
      .eq("id", roomId)
      .select()
      .single();

    if (error) {
      console.error("Error updating room name:", error);
      return Response.json(
        { message: "Failed to update room name", error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ message: "Room name updated successfully", data }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/room/update:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return Response.json({ message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0; 