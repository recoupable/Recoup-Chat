import { z } from "zod";
import { tool } from "ai";
import updateArtistSocials from "../supabase/updateArtistSocials";
import getSocialPlatformByLink from "../getSocialPlatformByLink";
import type { AccountSocialWithSocial } from "../supabase/accountSocials/getAccountSocials";

export interface UpdateArtistSocialsResult {
  success: boolean;
  message: string;
  socials?: AccountSocialWithSocial[];
}

const schema = z.object({
  artistId: z
    .string()
    .describe("The artist's account ID to update socials for."),
  urls: z
    .array(z.string())
    .describe(
      "An array of social profile URLs to associate with the artist. The platform will be inferred automatically."
    ),
});

const updateArtistSocialsTool = tool({
  description: `
    Update the artist_socials records for an artist. Provide the artistId and an array of social profile URLs. The tool will infer the platform for each URL and update the artist's socials accordingly.
  `,
  parameters: schema,
  execute: async ({ artistId, urls }): Promise<UpdateArtistSocialsResult> => {
    try {
      // Map each URL to its platform type
      const profileUrls: Record<string, string> = {};
      for (const url of urls) {
        const platform = getSocialPlatformByLink(url);
        if (platform && platform !== "NONE") {
          profileUrls[platform] = url;
        }
      }
      const socials = await updateArtistSocials(artistId, profileUrls);
      return {
        success: true,
        message: "Artist socials updated successfully.",
        socials,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update artist socials.",
      };
    }
  },
});

export default updateArtistSocialsTool;
