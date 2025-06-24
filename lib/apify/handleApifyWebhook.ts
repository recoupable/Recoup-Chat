import { Tables } from "@/types/database.types";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";
import { z } from "zod";
import {
  AccountSocialWithSocial,
} from "@/lib/supabase/accountSocials/getAccountSocials";
import handleInstagramProfileScraperResults from "@/lib/apify/handleInstagramProfileScraperResults";

/**
 * Handles the Apify webhook payload: routes to appropriate handler based on actorId.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with posts, socials, accountSocials, accountArtistIds, accountEmails, and sentEmails
 */
export default async function handleApifyWebhook(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  let posts: Tables<"posts">[] = [];
  let social: Tables<"socials"> | null = null;
  let accountSocials: AccountSocialWithSocial[] = [];
  let accountArtistIds: Tables<"account_artist_ids">[] = [];
  let accountEmails: Tables<"account_emails">[] = [];
  let sentEmails: unknown = null;

  try {
    // Only handle Instagram profile scraper results if actorId matches
    if (parsed.eventData.actorId === "dSCLg0C3YEZ83HzYX") {
      const result = await handleInstagramProfileScraperResults(parsed);
      posts = result.posts;
      social = result.social;
      accountSocials = result.accountSocials;
      accountArtistIds = result.accountArtistIds;
      accountEmails = result.accountEmails;
      sentEmails = result.sentEmails;
    } else {
      console.log(`Unhandled actorId: ${parsed.eventData.actorId}`);
    }
  } catch (e) {
    console.error("Failed to handle Apify webhook:", e);
  }

  return {
    posts,
    social,
    accountSocials,
    accountArtistIds,
    accountEmails,
    sentEmails,
  };
}
