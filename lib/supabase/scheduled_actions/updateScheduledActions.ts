import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

interface UpdateScheduledActionParams {
  id: string;
  updates: Partial<Omit<ScheduledAction, "id" | "created_at" | "updated_at">>;
}

export const updateScheduledActions = async ({
  id,
  updates,
}: UpdateScheduledActionParams): Promise<ScheduledAction> => {
  const { data, error } = await serverClient
    .from("scheduled_actions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating scheduled action:", error);
    throw error;
  }

  if (!data) {
    throw new Error(`No scheduled action found with id: ${id}`);
  }

  return data;
};
