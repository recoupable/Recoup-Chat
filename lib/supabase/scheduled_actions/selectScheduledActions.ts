import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

interface SelectScheduledActionsParams {
  account_id?: string;
  artist_account_id?: string;
  enabled?: boolean;
}

export const selectScheduledActions = async (
  params?: SelectScheduledActionsParams
): Promise<ScheduledAction[]> => {
  let query = serverClient.from("scheduled_actions").select();

  if (params?.account_id) {
    query = query.eq("account_id", params.account_id);
  }

  if (params?.artist_account_id) {
    query = query.eq("artist_account_id", params.artist_account_id);
  }

  if (params?.enabled !== undefined) {
    query = query.eq("enabled", params.enabled);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error selecting scheduled actions:", error);
    throw error;
  }

  return data;
};
