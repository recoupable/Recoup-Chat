import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { Database } from "@/packages/supabase/src/database.types";
import readArtists from "./readArtists";
import { validate } from "uuid";

type AccountArtistId =
  Database["public"]["Tables"]["account_artist_ids"]["Row"];
type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

type UpsertCampaignResponse = {
  data?: Campaign;
  error?: string;
  artists: AccountArtistId[];
};

/**
 * Creates a new campaign for an artist
 * @param artist_id The artist ID to create the campaign for
 * @param client_id The client ID associated with the campaign
 * @param email The email of the user creating the campaign
 * @returns The created campaign data or error with available artists
 */
export async function upsertCampaign(
  artist_id: string | undefined,
  client_id: string | undefined,
  email: string
): Promise<UpsertCampaignResponse> {
  try {
    // Get available artists for the user
    const artists = await readArtists(email);

    // Validate inputs
    if (!artist_id || !client_id || !validate(artist_id)) {
      return { error: "Invalid artist ID or client ID", artists };
    }

    const client = getSupabaseServerAdminClient();

    // Verify artist exists in account_artist_ids
    const { data: artistLink, error: artistError } = await client
      .from("account_artist_ids")
      .select("*")
      .eq("artist_id", artist_id)
      .single();

    if (artistError || !artistLink) {
      return { error: "Artist not found", artists };
    }

    // Create campaign
    const { data: campaign, error: campaignError } = await client
      .from("campaigns")
      .insert({
        artist_id,
        client_id,
        timestamp: Math.floor(Date.now() / 1000), // Convert to Unix timestamp
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      return { error: "Failed to create campaign", artists };
    }

    return { data: campaign, artists };
  } catch (error) {
    console.error("Error in upsertCampaign:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      artists: [],
    };
  }
}

export default upsertCampaign;
