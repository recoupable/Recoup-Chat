import { z } from "zod";
import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { tool } from "ai";
import { FAN_TYPE } from "@/types/fans";
import getFollows from "../chat/getFollows";
import limitCollection from "../limitCollection";

const getCampaign = (question: string, email: string, artistId: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to the following topics:
    1. Artists
    2. Albums
    3. Episodes
    4. Tracks
    5. Audio books
    6. Shows
    7. Fans (including premium, free, or total counts)
    8. Listening habits (from any platform, including Spotify and Apple)
    9. Campaign insights or data
    10. Any comparison or analysis of music consumption or fan behavior

    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "What are the listening habits from Spotify and Apple?"
    - "How many fans does the artist have?"
    - "What insights can we draw from the latest campaign?"
    - "How many premium subscribers are there?"

    When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
    parameters: z.object({}),
    execute: async () => {
      const client = getSupabaseServerAdminClient();
      const { data: campaign } = await client.rpc("get_campaign", {
        email,
        artistid: artistId,
        clientid: "",
      });

      const premiumCount =
        campaign?.fans?.filter((fan: FAN_TYPE) => fan.product === "premium")
          ?.length || 0;
      const freeCount =
        campaign?.fans?.filter((fan: FAN_TYPE) => fan.product === "free")
          ?.length || 0;
      const followers = getFollows(client);

      return {
        context: {
          tracks: limitCollection(campaign.tracks || []),
          artists: limitCollection(campaign.artists || []),
          playlists: limitCollection(campaign.playlists || []),
          albums: limitCollection(campaign.albums || []),
          audioBooks: limitCollection(campaign.audio_books || []),
          episodes: limitCollection(campaign.episodes || []),
          shows: limitCollection(campaign.shows || []),
          fans: limitCollection(campaign.fans || [], 1000),
          premiumCount,
          freeCount,
          totalFansCount: premiumCount + freeCount,
          totalFollowersCount: followers,
        },
        question,
      };
    },
  });

export default getCampaign;
