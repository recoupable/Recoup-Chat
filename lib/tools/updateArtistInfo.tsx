import { z } from "zod";
import { tool } from "ai";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { ArtistToolResponse } from "@/types/Tool";

const updateArtistInfo = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to the updating photo(image, avatar) of artist:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Update the image for my artists."
    - "Update the avatar for my artists."
    - "Update my artist photo."
    - "Update the artist photo for [artist name.]"`,
    parameters: z.object({
      artist_name: z.string().optional().describe("Name of artist"),
    }),
    execute: async ({ artist_name }) => {
      const client = getSupabaseServerAdminClient();
      const { data } = await client
        .from("artists")
        .select("*")
        .eq("name", artist_name);

      return {
        context: {
          status: ArtistToolResponse.UPDATED_ARTIST_INFO,
          artist: data?.[0] || null,
        },
        question,
      };
    },
  });

export default updateArtistInfo;
