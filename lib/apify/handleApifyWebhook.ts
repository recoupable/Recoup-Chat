import getDataset from "@/lib/apify/getDataset";
import { ApifyInstagramPost } from "@/types/Apify";
import saveApifyInstagramPosts from "@/lib/apify/saveApifyInstagramPosts";
import { Tables } from "@/types/database.types";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";
import { z } from "zod";
import insertSocial from "@/lib/supabase/socials/insertSocial";
import getSocialByProfileUrl from "@/lib/supabase/socials/getSocialByProfileUrl";
import getAccountSocials, {
  AccountSocialWithSocial,
} from "@/lib/supabase/accountSocials/getAccountSocials";
import insertSocialPosts from "@/lib/supabase/socialPosts/insertSocialPosts";
import getAccountArtistIdsByArtistId from "@/lib/supabase/accountArtistIds/getAccountArtistIdsByArtistId";
import getAccountEmails from "../supabase/accountEmails/getAccountEmails";
import sendApifyWebhookEmail from "@/lib/apify/sendApifyWebhookEmail";
import normalizeProfileUrl from "@/lib/utils/normalizeProfileUrl";

/**
 * Handles the Apify webhook payload: fetches dataset, saves posts, saves socials, and returns results.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with supabasePosts, supabaseSocials, accountSocials, accountArtistIds, accountEmails, and sentEmails
 */
export default async function handleApifyWebhook(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  const datasetId = parsed.resource.defaultDatasetId;
  let supabasePosts: Tables<"posts">[] = [];
  const supabaseSocials: Tables<"socials">[] = [];
  let accountSocials: AccountSocialWithSocial[] = [];
  let accountArtistIds: Tables<"account_artist_ids">[] = [];
  let accountEmails: Tables<"account_emails">[] = [];
  let sentEmails: unknown = null;
  let dataset;
  if (datasetId) {
    try {
      dataset = await getDataset(datasetId);
      const firstResult = dataset[0];
      if (Array.isArray(dataset) && firstResult?.latestPosts) {
        // Save posts
        const { supabasePosts: sp } = await saveApifyInstagramPosts(
          firstResult.latestPosts as ApifyInstagramPost[]
        );
        supabasePosts = sp;
        await insertSocial({
          username: firstResult.username,
          avatar: firstResult.profilePicUrl,
          profile_url: firstResult.url,
          bio: firstResult.biography,
          followerCount: firstResult.followersCount,
          followingCount: firstResult.followsCount,
        });
        const normalizedUrl = normalizeProfileUrl(firstResult.url);
        console.log("normalizedUrl", normalizedUrl);
        const social = await getSocialByProfileUrl(normalizedUrl);
        console.log("social", social);
        if (social) {
          supabaseSocials.push(social);
          if (supabasePosts.length) {
            const socialPostRows = supabasePosts.map((post) => ({
              post_id: post.id,
              updated_at: post.updated_at,
              social_id: social.id,
            }));
            await insertSocialPosts(socialPostRows);
          }
        }
      }
    } catch (e) {
      console.error("Failed to handle Apify webhook:", e);
    }
  }
  if (supabaseSocials.length > 0) {
    const socialIds = supabaseSocials.map((s) => s.id);
    accountSocials = await getAccountSocials({ socialId: socialIds });
    console.log("accountSocials", accountSocials);
    const { data } = await getAccountArtistIdsByArtistId(
      accountSocials[0].account_id as string
    );
    accountArtistIds = data || [];
    // Get emails for all unique account_ids
    const uniqueAccountIds = Array.from(
      new Set(accountArtistIds.map((a) => a.account_id).filter(Boolean))
    );
    const emails = await getAccountEmails(uniqueAccountIds as string[]);
    console.log("emails", emails);
    accountEmails = emails;
    // Send the Apify webhook email using the new utility
    sentEmails = await sendApifyWebhookEmail(
      dataset[0],
      emails.map((e) => e.email).filter(Boolean) as string[]
    );
  }
  return {
    supabasePosts,
    supabaseSocials,
    accountSocials,
    accountArtistIds,
    accountEmails,
    sentEmails,
  };
}
