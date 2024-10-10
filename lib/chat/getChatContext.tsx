import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getFandata from "./getFandata";
import { HABIT_INSTRUCTION, INSTRUCTION } from "./const";
import getFollows from "./getFollows";
import getTopScore from "./getTopScore";
import getMostPlayed from "./getMostPlayed";
import getStreamsCount from "./getStreamsCount";
import getSpotifyFansPast7 from "./getSpotifyFansInPast";
import getStartedFans from "./getStartedFans";
import getFollowersInPast from "./getFollowersInPast";
import getUsersScore from "../stack/getUsersScore";
import { SCORE_EVENT } from "@/types/score";
import getRecentScore from "./getRecentScore";
import getScoresInPast24 from "./getScoresInPast24";

const getChatContext = async (isHabitQuestion: boolean) => {
  const context = [];
  const client = getSupabaseServerAdminClient();
  const { data: fans } = await client.from("fans").select("*");
  const scores: SCORE_EVENT[] = await getUsersScore();

  if (fans?.length && fans[0]) {
    const rows = fans.map((fan) => {
      const data = getFandata(fan);
      return Object.values(data);
    });

    context.push(isHabitQuestion ? HABIT_INSTRUCTION : INSTRUCTION);

    const fanContext = `\n\n1. Fans for the latest campaign in the format (userNames, artistNames, country, city, user_type):\n\t
    ${rows.join("\n\t")}`;
    context.push(fanContext);

    if (!isHabitQuestion) {
      const follows = await getFollows(client);
      context.push(`\n2. Followers: ${follows}`);

      const topScore = getTopScore(scores);
      context.push(`\n3. Highest scoring fan: ${topScore.metadata.username}`);

      const mostPlayedFan = getMostPlayed(scores);
      context.push(`\n4. Most played fan: ${mostPlayedFan}`);

      const streamsCount = await getStreamsCount(client);
      context.push(`\n5. Streams Count: ${streamsCount}`);

      const usersInPast7 = await getSpotifyFansPast7(
        client,
        7 * 24 * 60 * 60 * 1000,
      );
      const userRows = usersInPast7.map((user) => Object.values(user));
      const usersContext = `\n\n6. Users signed in with spotify in the past 7 days in the format ( Name, Country, Game, Timestamp ):\n\t
      ${userRows.length ? userRows.join("\n\t") : "There are no users signed in in the past 7 days."}`;
      context.push(usersContext);

      const startedFansCount = await getStartedFans(client);
      context.push(
        `\n7. Users started signing in with spotify: ${startedFansCount}`,
      );

      const followersCount = await getFollowersInPast(
        client,
        24 * 60 * 60 * 1000,
      );
      context.push(`\n8. New followers in past 24hrs: ${followersCount}`);

      const recentScore = getRecentScore(scores);
      context.push(
        `\n9. Fan who has the most recent score: ${recentScore.metadata.username}`,
      );

      const scoresInPast24 = getScoresInPast24(scores);
      context.push(
        `\n10. Count of people scored in the past 24hrs: ${scoresInPast24}`,
      );

      context.push(`\n11. Count of fans: ${fans.length}`);
    }
  }
  return context.join("\n");
};

export default getChatContext;
