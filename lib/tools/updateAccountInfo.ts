import { z } from "zod";
import { tool } from "ai";
import updateArtistProfile, {
  ArtistProfile,
} from "@/lib/supabase/artist/updateArtistProfile";

/**
 * Result type for updateAccountInfo tool
 */
export interface UpdateAccountInfoResult {
  success: boolean;
  artistProfile?: ArtistProfile;
  message: string;
  error?: string;
}

const schema = z.object({
  artistId: z
    .string()
    .describe(
      "The artist_account_id to update. If not provided, check system prompt for the active artist_account_id."
    ),
  email: z
    .string()
    .optional()
    .describe("(Optional) The new email address for the artist."),
  image: z
    .string()
    .optional()
    .describe("(Optional) The new profile image URL for the artist."),
  name: z
    .string()
    .optional()
    .describe("(Optional) The display name for the artist."),
  instruction: z
    .string()
    .optional()
    .describe("(Optional) Custom instructions for the artist's account."),
  label: z
    .string()
    .optional()
    .describe("(Optional) The label or role for the artist."),
  knowledges: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
        type: z
          .string()
          .describe(
            'MIME type of the file, e.g., "text/plain" for TXT files, "application/pdf" for PDFs'
          ),
      })
    )
    .optional()
    .describe(
      "(Optional) Array of knowledge objects ({ url, name, type }) to be stored as the knowledge base or notes for the artist. The 'type' field must be a valid MIME type (e.g., 'text/plain' for TXT files)."
    ),
});

const updateAccountInfo = tool({
  description: `
  Update the account_info record for an artist. All fields are optional except for artistId. This tool is used to update the artist's profile image, name, instructions, label, and knowledge base. If artistId is not provided, use the active artist_account_id from the system prompt.
  `,
  parameters: schema,
  execute: async ({
    artistId,
    email,
    image,
    name,
    instruction,
    label,
    knowledges,
  }): Promise<UpdateAccountInfoResult> => {
    try {
      // knowledges is now an array of objects or undefined
      const artistProfile = await updateArtistProfile(
        artistId,
        email || "",
        image || "",
        name || "",
        instruction || "",
        label || "",
        knowledges || []
      );
      return {
        success: true,
        artistProfile,
        message: `Account info updated successfully for account_id: ${artistProfile.account_id}`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update account info";
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  },
});

export default updateAccountInfo;
