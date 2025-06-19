import { z } from "zod";
import { tool } from "ai";
import { updateScheduledActions } from "@/lib/supabase/scheduled_actions/updateScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface UpdateScheduledActionResult {
  action: ScheduledAction;
  message: string;
  error?: string;
}

const updateScheduledAction = tool({
  description: `
  Update an existing scheduled action in the system. Requires the action ID and the fields to update.
  Updatable fields include:
  - title: A descriptive name for the scheduled action
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the action should run
  - enabled: Whether the action is enabled or disabled
  - account_id: The account ID of the user who owns the action
  - artist_account_id: The account ID of the artist this action is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  You cannot update the id, created_at, or updated_at fields.
  `,
  parameters: z.object({
    id: z.string().describe("The ID of the scheduled action to update"),
    updates: z
      .object({
        title: z
          .string()
          .optional()
          .describe("The new title for the scheduled action"),
        prompt: z
          .string()
          .optional()
          .describe("The new instruction or prompt to be executed"),
        schedule: z
          .string()
          .optional()
          .describe("New cron expression for when the action should run"),
        enabled: z
          .boolean()
          .optional()
          .describe("Whether the action should be enabled or disabled"),
        account_id: z
          .string()
          .optional()
          .describe("The new account ID of the user who owns the action"),
        artist_account_id: z
          .string()
          .optional()
          .describe("The new artist account ID this action is for"),
      })
      .describe("The fields to update on the scheduled action"),
  }),
  execute: async ({ id, updates }): Promise<UpdateScheduledActionResult> => {
    try {
      const action = await updateScheduledActions({ id, updates });

      return {
        action,
        message: `Successfully updated scheduled action "${action.title}"`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update scheduled action for unknown reason";
      return {
        action: {} as ScheduledAction,
        error: errorMessage,
        message: `Failed to update scheduled action: ${errorMessage}`,
      };
    }
  },
});

export default updateScheduledAction;
