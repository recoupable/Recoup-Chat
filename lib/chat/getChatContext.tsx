import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
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
import getFans from "./getFans";
import { INSTRUCTION, NOTES } from "./const";
import getFanSegments from "./getFanSegments";
import getScoreContext from "./getScoreContext";

const getChatContext = async () => {
  const context = [];
  const client = getSupabaseServerAdminClient();
  const scores: SCORE_EVENT[] = await getUsersScore();

  context.push(NOTES);
  context.push(INSTRUCTION);

  context.push(
    `\n\n1. Fans for the latest campaign in the format (userNames, artistNames, country, city, user_type, segment_type):\n\t`,
  );
  const fanContext = await getFans(client);
  context.push(fanContext);

  await getFanSegments(client);
  const follows = await getFollows(client);
  context.push(`\n2. Followers: ${follows}`);

  let scoreContext = `\n3. Scores of fan ( please calculate a count for each username to indicate the number of times each player has played the game.) \n`;
  scores.map((score: SCORE_EVENT) => {
    scoreContext = scoreContext + getScoreContext(score) + "\n";
  });
  context.push(scoreContext);

  const topScore = getTopScore(scores);
  context.push(`\n4. Highest scoring fan: ${getScoreContext(topScore)}`);

  const mostPlayedFan = getMostPlayed(scores);
  context.push(`\n5. Most played fan: ${mostPlayedFan}`);

  const streamsCount = await getStreamsCount(client);
  context.push(`\n6. Streams Count: ${streamsCount}`);

  const usersInPast7 = await getSpotifyFansPast7(
    client,
    7 * 24 * 60 * 60 * 1000,
  );
  const userRows = usersInPast7.map((user) => Object.values(user));
  const usersContext = `\n\n7. Users signed in with spotify in the past 7 days in the format ( Name, Country, Game, Timestamp ):\n\t
  ${userRows.length ? userRows.join("\n\t") : "There are no users signed in in the past 7 days."}`;
  context.push(usersContext);

  const startedFansCount = await getStartedFans(client);
  context.push(
    `\n8. Users started signing in with spotify: ${startedFansCount}`,
  );

  const followersCount = await getFollowersInPast(client, 24 * 60 * 60 * 1000);
  context.push(`\n9. New followers in past 24hrs: ${followersCount}`);

  const recentScore = getRecentScore(scores);
  context.push(
    `\n10. Fan who has the most recent score: ${getScoreContext(recentScore)}`,
  );

  const scoresInPast24 = getScoresInPast24(scores);
  context.push(
    `\n11. Count of people scored in the past 24hrs: ${scoresInPast24}`,
  );

  return context.join("\n");
};

export default getChatContext;
