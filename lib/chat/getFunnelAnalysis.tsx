import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";

const getFunnelAnalysis = async (chat_id: string) => {
  const client = getSupabaseServerAdminClient();
  const { data } = await client
    .from("funnel_analytics")
    .select(
      `*,
      funnel_analytics_segments (
        *
      ),
      funnel_analytics_profile (
        *,
        artists (
          *,
          artist_social_links (
            *
          )
        )
      )`,
    )
    .eq("chat_id", chat_id);

  return data;
};

export default getFunnelAnalysis;