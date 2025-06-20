import { z } from "zod";
import { tool } from "ai";
import { insertScheduledActions } from "@/lib/supabase/scheduled_actions/insertScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface CreateScheduledActionsResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const createScheduledActions = tool({
  description: `
  Create new scheduled actions in the system. Each action represents a task that will be executed on a schedule.
  Requires the following for each action:
  - title: A descriptive name for the scheduled action
  - prompt: The instruction or prompt to be executed
  - schedule: A cron expression defining when the action should run
  - account_id: The account ID of the user creating the action
  - artist_account_id: The account ID of the artist this action is for
  
  The schedule parameter must be a valid cron expression (e.g. "0 0 * * *" for daily at midnight).
  `,
  parameters: z.object({
    actions: z
      .array(
        z.object({
          title: z.string().describe("The title of the scheduled action"),
          prompt: z
            .string()
            .describe("The instruction or prompt to be executed"),
          schedule: z
            .string()
            .describe("Cron expression for when the action should run"),
          account_id: z
            .string()
            .describe(
              "The account ID of the user creating the action. Get this from the system prompt. Do not ask for this."
            ),
          artist_account_id: z
            .string()
            .describe(
              "The account ID of the artist this action is for. If not provided, get this from the system prompt as the active artist id."
            ),
          enabled: z
            .boolean()
            .optional()
            .describe("Whether the action is enabled (defaults to true)"),
        })
      )
      .describe("Array of scheduled actions to create"),
  }),
  execute: async ({ actions }): Promise<CreateScheduledActionsResult> => {
    try {
      const createdActions = await insertScheduledActions(actions);

      return {
        actions: createdActions,
        message: `Successfully created ${createdActions.length} scheduled action(s)`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create scheduled actions for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to create scheduled actions: ${errorMessage}`,
      };
    }
  },
});

export default createScheduledActions;
