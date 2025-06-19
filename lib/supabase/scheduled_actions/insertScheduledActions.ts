import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;
type ScheduledActionInsert = Partial<ScheduledAction>;

export const insertScheduledActions = async (
  actions: ScheduledActionInsert[]
): Promise<ScheduledAction[]> => {
  const { data, error } = await serverClient
    .from("scheduled_actions")
    .insert(actions)
    .select();

  if (error) {
    console.error("Error inserting scheduled actions:", error);
    throw error;
  }

  return data;
};
