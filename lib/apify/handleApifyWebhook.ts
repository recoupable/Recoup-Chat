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
  try {
    // Only handle Instagram profile scraper results if actorId matches
    if (parsed.eventData.actorId === "dSCLg0C3YEZ83HzYX") {
      return await handleInstagramProfileScraperResults(parsed);
    } else {
      console.log(`Unhandled actorId: ${parsed.eventData.actorId}`);
      return {
        posts: [],
        social: null,
        accountSocials: [],
        accountArtistIds: [],
        accountEmails: [],
        sentEmails: null,
      };
    }
  } catch (e) {
    console.error("Failed to handle Apify webhook:", e);
    return {
      posts: [],
      social: null,
      accountSocials: [],
      accountArtistIds: [],
      accountEmails: [],
      sentEmails: null,
    };
  }
}
