import { z } from "zod";
import { tool } from "ai";
import { updateScheduledActions } from "@/lib/supabase/scheduled_actions/updateScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface UpdateScheduledActionResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const updateScheduledAction = tool({
  description: `
  Update multiple existing scheduled actions in the system. Requires an array of action IDs and the fields to update.
  The same updates will be applied to all specified actions.

  Updatable fields include:
  - title: A descriptive name for the scheduled action
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the action should run
  - enabled: Whether the action is enabled or disabled
  - account_id: The account ID of the user who owns the action
  - artist_account_id: The account ID of the artist this action is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  You cannot update the id, created_at, or updated_at fields.

  All specified actions will receive the same updates. If you need different updates for different actions,
  make multiple calls to this tool.
  `,
  parameters: z.object({
    ids: z
      .array(z.string())
      .min(1)
      .describe("Array of IDs of the scheduled actions to update"),
    updates: z
      .object({
        title: z
          .string()
          .optional()
          .describe("The new title for the scheduled actions"),
        prompt: z
          .string()
          .optional()
          .describe("The new instruction or prompt to be executed"),
        schedule: z
          .string()
          .optional()
          .describe("New cron expression for when the actions should run"),
        enabled: z
          .boolean()
          .optional()
          .describe("Whether the actions should be enabled or disabled"),
        account_id: z
          .string()
          .optional()
          .describe("The new account ID of the user who owns the actions"),
        artist_account_id: z
          .string()
          .optional()
          .describe("The new artist account ID these actions are for"),
      })
      .describe("The fields to update on the scheduled actions"),
  }),
  execute: async ({ ids, updates }): Promise<UpdateScheduledActionResult> => {
    try {
      const actions = await updateScheduledActions({ ids, updates });
      const updatedCount = actions.length;
      const totalCount = ids.length;
      const partialUpdate = updatedCount !== totalCount;

      let message = `Successfully updated ${updatedCount} scheduled action(s)`;
      if (partialUpdate) {
        message += ` (${totalCount - updatedCount} actions were not found or could not be updated)`;
      }

      return {
        actions,
        message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update scheduled actions for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to update scheduled actions: ${errorMessage}`,
      };
    }
  },
});

export default updateScheduledAction;
