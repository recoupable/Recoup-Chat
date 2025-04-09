import { PostgrestError } from "@supabase/supabase-js";
import supabase from "./serverClient";
import { Database } from "@/types/database.types";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

interface CreateRoomParams {
  account_id: string;
  topic: string;
  report_id?: string;
  artist_id?: string;
  custom_id?: string;
}

export const createRoomWithReport = async ({
  account_id,
  topic,
  report_id,
  artist_id,
  custom_id,
}: CreateRoomParams): Promise<{
  new_room: Room & { memories: []; rooms_reports: string[] };
  error: PostgrestError | null;
}> => {
  try {
    const insertData: {
      account_id: string;
      topic: string;
      artist_id?: string;
      id?: string;
    } = {
      account_id,
      topic,
      artist_id,
    };

    if (custom_id) {
      insertData.id = custom_id;
    }

    const { data: new_room, error } = await supabase
      .from("rooms")
      .insert(insertData)
      .select("*")
      .single();

    if (error) throw error;

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
