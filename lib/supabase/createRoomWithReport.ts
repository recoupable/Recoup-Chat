import { PostgrestError } from "@supabase/supabase-js";
import supabase from "./serverClient";

interface CreateRoomParams {
  account_id: string;
  topic: string;
  report_id?: string;
}

interface Room {
  id: string;
  account_id: string | null;
  topic: string | null;
  updated_at: string;
}

export const createRoomWithReport = async ({
  account_id,
  topic,
  report_id,
}: CreateRoomParams): Promise<{
  new_room: Room & { memories: []; rooms_reports: string[] };
  error: PostgrestError | null;
}> => {
  try {
    // Create room
    const { data: new_room, error } = await supabase
      .from("rooms")
      .insert({
        account_id,
        topic,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Link report if provided
    if (report_id) {
      await supabase.from("room_reports").insert({
        room_id: new_room.id,
        report_id,
      });
    }

    return {
      new_room: {
        ...new_room,
        memories: [],
        rooms_reports: report_id ? [report_id] : [],
      },
      error: null,
    };
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};
