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

/**
 * Handles the Apify webhook payload: fetches dataset, saves posts, saves socials, and returns results.
 * @param parsed - The parsed and validated Apify webhook payload
 * @returns An object with supabasePosts and supabaseSocials
 */
export default async function handleApifyWebhook(
  parsed: z.infer<typeof apifyPayloadSchema>
) {
  const datasetId = parsed.resource.defaultDatasetId;
  let supabasePosts: Tables<"posts">[] = [];
  const supabaseSocials: Tables<"socials">[] = [];
  let accountSocials: AccountSocialWithSocial[] = [];
  if (datasetId) {
    try {
      const dataset = await getDataset(datasetId);
      const firstResult = dataset[0];
      console.log("firstResult", firstResult);
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
        const social = await getSocialByProfileUrl(firstResult.url);
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
  }
  return { supabasePosts, supabaseSocials, accountSocials };
}
