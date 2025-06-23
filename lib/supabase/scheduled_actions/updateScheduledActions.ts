import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

interface UpdateScheduledActionParams {
  ids: string[];
  updates: Partial<Omit<ScheduledAction, "id" | "created_at" | "updated_at">>;
}

export const updateScheduledActions = async ({
  ids,
  updates,
}: UpdateScheduledActionParams): Promise<ScheduledAction[]> => {
  const { data, error } = await serverClient
    .from("scheduled_actions")
    .update(updates)
    .in("id", ids)
    .select();

  if (error) {
    console.error("Error updating scheduled actions:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`No scheduled actions found with ids: ${ids.join(", ")}`);
  }

  if (data.length !== ids.length) {
    console.warn(
      `Warning: Only ${data.length} of ${ids.length} actions were updated`
    );
  }

  return data;
};
