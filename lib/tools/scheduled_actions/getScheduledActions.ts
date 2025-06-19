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
  Retrieve scheduled actions from the system. Can filter by account_id, artist_account_id, and enabled status.
  All filter parameters are optional:
  - account_id: Filter actions by the user who created them
  - artist_account_id: Filter actions by the artist they are for
  - enabled: Filter actions by their enabled status (true/false)
  
  If no filters are provided, returns all scheduled actions the user has access to.
  `,
  parameters: z.object({
    account_id: z
      .string()
      .optional()
      .describe(
        "Optional: Filter actions by the account ID of the user who created them. Get this from the system prompt. Do not ask for this."
      ),
    artist_account_id: z
      .string()
      .optional()
      .describe(
        "Optional: Filter actions by the artist account ID. If not provided, get this from the system prompt as the active artist id."
      ),
    enabled: z
      .boolean()
      .optional()
      .describe("Optional: Filter actions by their enabled status"),
  }),
  execute: async ({
    account_id,
    artist_account_id,
    enabled,
  }): Promise<GetScheduledActionsResult> => {
    try {
      const actions = await selectScheduledActions({
        account_id,
        artist_account_id,
        enabled,
      });

      return {
        actions,
        message: `Successfully retrieved ${actions.length} scheduled action(s)`,
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
