import { z } from "zod";
import { tool } from "ai";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { ArtistToolResponse } from "@/types/Tool";
import { Database } from "@/packages/supabase/src/database.types";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

type UpdateArtistResponse = {
  context: {
    status: ArtistToolResponse;
    artist: Account | null;
    error?: string;
  };
  question: string;
};

const updateArtistInfo = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to the updating info of artist:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Update the image for my artists."
    - "Update the avatar for my artists."
    - "Update my artist photo."
    - "Update the artist photo for [artist name.]"`,
    parameters: z.object({
      artist_name: z.string().optional().describe("Name of artist"),
    }),
    execute: async ({ artist_name }): Promise<UpdateArtistResponse> => {
      if (!artist_name) {
        return {
          context: {
            status: ArtistToolResponse.UPDATED_ARTIST_INFO,
            artist: null,
            error: "Artist name is required",
          },
          question,
        };
      }

      const client = getSupabaseServerAdminClient();
      const { data, error } = await client
        .from("accounts")
        .select("*")
        .eq("name", artist_name)
        .single();

      if (error) {
        return {
          context: {
            status: ArtistToolResponse.UPDATED_ARTIST_INFO,
            artist: null,
            error: "Artist not found",
          },
          question,
        };
      }

      return {
        context: {
          status: ArtistToolResponse.UPDATED_ARTIST_INFO,
          artist: data,
        },
        question,
      };
    },
  });

export default updateArtistInfo;
