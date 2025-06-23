import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export const deleteScheduledActions = async (
  ids: string[]
): Promise<ScheduledAction[]> => {
  const { data, error } = await serverClient
    .from("scheduled_actions")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    console.error("Error deleting scheduled actions:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`No scheduled actions found with ids: ${ids.join(", ")}`);
  }

  return data;
};
