import getDataset from "@/lib/apify/getDataset";
import { ApifyInstagramPost } from "@/types/Apify";
import saveApifyInstagramPosts from "@/lib/apify/saveApifyInstagramPosts";
import { Tables } from "@/types/database.types";
import { z } from "zod";
import insertSocial from "@/lib/supabase/socials/insertSocial";
import getSocialByProfileUrl from "@/lib/supabase/socials/getSocialByProfileUrl";
import getAccountSocials, {
  AccountSocialWithSocial,
} from "@/lib/supabase/accountSocials/getAccountSocials";
import insertSocialPosts from "@/lib/supabase/socialPosts/insertSocialPosts";
import getAccountArtistIds from "@/lib/supabase/accountArtistIds/getAccountArtistIds";
import getAccountEmails from "../supabase/accountEmails/getAccountEmails";
import sendApifyWebhookEmail from "@/lib/apify/sendApifyWebhookEmail";
import normalizeProfileUrl from "@/lib/utils/normalizeProfileUrl";
import uploadLinkToArweave from "@/lib/arweave/uploadLinkToArweave";
import runInstagramCommentsScraper from "@/lib/apify/runInstagramCommentsScraper";
import getExistingPostComments from "@/lib/apify/getExistingPostComments";
import apifyPayloadSchema from "@/lib/apify/apifyPayloadSchema";

/**
 * Handles Instagram profile scraper results: fetches dataset, saves posts, saves socials, and returns results.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with posts, socials, accountSocials, accountArtistIds, accountEmails, and sentEmails
 */
export default async function handleInstagramProfileScraperResults(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  const datasetId = parsed.resource.defaultDatasetId;
  let posts: Tables<"posts">[] = [];
  let social: Tables<"socials"> | null = null;
  let accountSocials: AccountSocialWithSocial[] = [];
  let accountArtistIds: Tables<"account_artist_ids">[] = [];
  let accountEmails: Tables<"account_emails">[] = [];
  let sentEmails: unknown = null;
  let dataset;

  if (datasetId) {
    dataset = await getDataset(datasetId);
    const firstResult = dataset[0];
    if (firstResult?.latestPosts) {
      // Save posts
      const { supabasePosts: sp } = await saveApifyInstagramPosts(
        firstResult.latestPosts as ApifyInstagramPost[]
      );
      posts = sp;
      const arweaveResult = await uploadLinkToArweave(
        firstResult.profilePicUrlHD || firstResult.profilePicUrl
      );
      if (arweaveResult && arweaveResult.url) {
        firstResult.profilePicUrl = arweaveResult.url;
      }

      await insertSocial({
        username: firstResult.username,
        avatar: firstResult.profilePicUrl,
        profile_url: firstResult.url,
        bio: firstResult.biography,
        followerCount: firstResult.followersCount,
        followingCount: firstResult.followsCount,
      });
      const normalizedUrl = normalizeProfileUrl(firstResult.url);
      social = await getSocialByProfileUrl(normalizedUrl);
      console.log("social", social);
      if (social) {
        if (posts.length) {
          const socialPostRows = posts.map((post) => ({
            post_id: post.id,
            updated_at: post.updated_at,
            social_id: social!.id,
          }));
          await insertSocialPosts(socialPostRows);
        }
        const socialIds = [social.id];
        accountSocials = await getAccountSocials({ socialId: socialIds });
        console.log("accountSocials", accountSocials);
        accountArtistIds = await getAccountArtistIds({
          artistIds: accountSocials.map((a) => a.account_id as string),
        });
        // Get emails for all unique account_ids
        const uniqueAccountIds = Array.from(
          new Set(accountArtistIds.map((a) => a.account_id).filter(Boolean))
        );
        const emails = await getAccountEmails(uniqueAccountIds as string[]);
        console.log("emails", emails);
        accountEmails = emails;
        // Send the Apify webhook email using the new utility
        sentEmails = await sendApifyWebhookEmail(
          firstResult,
          emails.map((e) => e.email).filter(Boolean) as string[]
        );

        // Trigger comment scraping for the new posts
        // Only call runInstagramCommentsScraper if dataset.length === 1
        // If more than 1 profile, these are fans and should only be saved
        if (dataset.length === 1 && firstResult.latestPosts && firstResult.latestPosts.length > 0) {
          const postUrls = (firstResult.latestPosts as ApifyInstagramPost[])
            .map((post) => post.url)
            .filter(Boolean);
          
          if (postUrls.length > 0) {
            console.log("Checking existing comments for posts:", postUrls);
            
            // Get existing comments for these post URLs
            const { urlsWithComments, urlsWithoutComments } = await getExistingPostComments(postUrls);
            
            // Handle posts with existing comments (use resultsLimit)
            if (urlsWithComments.length > 0) {
              console.log("Triggering comment scraping for posts with existing comments (resultsLimit=1):", urlsWithComments);
              await runInstagramCommentsScraper(urlsWithComments, 1);
            }
            
            // Handle posts without existing comments (no resultsLimit)
            if (urlsWithoutComments.length > 0) {
              console.log("Triggering comment scraping for posts without existing comments:", urlsWithoutComments);
              await runInstagramCommentsScraper(urlsWithoutComments);
            }
          }
        }
      }
    }
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