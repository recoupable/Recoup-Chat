import { z } from "zod";
import { tool } from "ai";
import { selectScheduledActions } from "@/lib/supabase/scheduled_actions/selectScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface GetScheduledActionsResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const getScheduledActions = tool({
  description: `
  Retrieve scheduled actions from the system. Can filter by account_id, artist_account_ids, and enabled status.
  All filter parameters are optional:
  - account_id: Filter actions by the user who created them
  - artist_account_ids: Filter actions by an array of artist IDs they are for
  - enabled: Filter actions by their enabled status (true/false)
  
  If no filters are provided, returns all scheduled actions the user has access to.
  If artist_account_ids is provided, returns actions for any of the specified artists.
  `,
  parameters: z.object({
    account_id: z
      .string()
      .optional()
      .describe(
        "Optional: Filter actions by the account ID of the user who created them. Get this from the system prompt. Do not ask for this."
      ),
    artist_account_ids: z
      .array(z.string())
      .optional()
      .describe(
        "Optional: Filter actions by an array of artist account IDs. If not provided, get the active artist id from the system prompt."
      ),
    enabled: z
      .boolean()
      .optional()
      .describe("Optional: Filter actions by their enabled status"),
  }),
  execute: async ({
    account_id,
    artist_account_ids,
    enabled,
  }): Promise<GetScheduledActionsResult> => {
    try {
      const actions = await selectScheduledActions({
        account_id,
        artist_account_ids,
        enabled,
      });

      const artistCount = artist_account_ids?.length ?? 0;
      const artistMessage =
        artistCount > 0 ? ` across ${artistCount} artist(s)` : "";

      return {
        actions,
        message: `Successfully retrieved ${actions.length} scheduled action(s)${artistMessage}`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve scheduled actions for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to retrieve scheduled actions: ${errorMessage}`,
      };
    }
  },
});

export default getScheduledActions;
