import { z } from "zod";
import { tool } from "ai";

const createArtist = tool({
  description: `
  Create a new artist account in the system.
  This tool should be called when a user wants to create a new artist profile.
  Requires the artist name and the account ID of the user with admin access to the new artist account.
  `,
  parameters: z.object({
    name: z.string().describe("The name of the artist to be created"),
    account_id: z
      .string()
      .describe(
        "The account ID of the human with admin access to the new artist account"
      ),
  }),
  execute: async ({ name, account_id }) => {
    try {
      const response = await fetch(
        `/api/artist/create?name=${encodeURIComponent(name)}&account_id=${encodeURIComponent(account_id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create artist: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return {
        artist: data.artist,
        message: `Successfully created artist "${name}".`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create artist for unknown reason";
      return {
        error: errorMessage,
        message: `Failed to create artist: ${errorMessage}`,
      };
    }
  },
});

export default createArtist;
