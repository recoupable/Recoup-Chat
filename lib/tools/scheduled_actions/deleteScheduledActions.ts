import { z } from "zod";
import { tool } from "ai";
import { deleteScheduledActions } from "@/lib/supabase/scheduled_actions/deleteScheduledActions";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;

export interface DeleteScheduledActionsResult {
  actions: ScheduledAction[];
  message: string;
  error?: string;
}

const deleteScheduledAction = tool({
  description: `
  Delete one or more scheduled actions from the system. Requires an array of action IDs to delete.
  `,
  parameters: z.object({
    ids: z
      .array(z.string())
      .min(1)
      .describe("Array of IDs of the scheduled actions to delete."),
  }),
  execute: async ({ ids }): Promise<DeleteScheduledActionsResult> => {
    try {
      const actions = await deleteScheduledActions(ids);
      const deletedCount = actions.length;

      return {
        actions,
        message: `Successfully deleted ${deletedCount} scheduled action(s).`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete scheduled actions for unknown reason";
      return {
        actions: [],
        error: errorMessage,
        message: `Failed to delete scheduled actions: ${errorMessage}`,
      };
    }
  },
});

export default deleteScheduledAction;
