import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
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
import { INSTRUCTION } from "./const";

const getChatContext = async (email: string, artistId: string) => {
  const context = [];
  const client = getSupabaseServerAdminClient();
  const scores: SCORE_EVENT[] = await getUsersScore();
  context.push(INSTRUCTION);

  let scoreContext = `\n1. Scores of fan ( please calculate a count for each username to indicate the number of times each player has played the game.) \n`;
  scores.map((score: SCORE_EVENT) => {
    scoreContext =
      scoreContext +
      `{ username: "${score.metadata.username}", timeToGetScore: ${score.metadata.time}, fanId: "${score.metadata.userId}", score: ${score.points}, playedAt: ${new Date(score.timestamp).toDateString()}}\n`;
  });
  context.push(scoreContext);

  const topScore = getTopScore(scores);
  context.push(
    `\n2. Highest scoring fan: ${topScore.metadata.username}(score is ${topScore.points})`,
  );

  const mostPlayedFan = getMostPlayed(scores);
  context.push(`\n3. Most played fan: ${mostPlayedFan}`);

  const streamsCount = await getStreamsCount(client, email, artistId);
  context.push(`\n4. Streams Count: ${streamsCount}`);

  const usersInPast7 = await getSpotifyFansPast7(
    client,
    7 * 24 * 60 * 60 * 1000,
  );
  const userRows = usersInPast7.map((user) => Object.values(user));
  const usersContext = `\n\n5. Users signed in with spotify in the past 7 days in the format ( Name, Country, Game, Timestamp ):\n\t
  ${userRows.length ? userRows.join("\n\t") : "There are no users signed in in the past 7 days."}`;
  context.push(usersContext);

  const startedFansCount = await getStartedFans(client);
  context.push(
    `\n6. Users started signing in with spotify: ${startedFansCount}`,
  );

  const followersCount = await getFollowersInPast(client, 24 * 60 * 60 * 1000);
  context.push(`\n7. New followers in past 24hrs: ${followersCount}`);

  const recentScore = getRecentScore(scores);
  context.push(
    `\n8. Fan who has the most recent score: ${recentScore.metadata.username}`,
  );

  const scoresInPast24 = getScoresInPast24(scores);
  context.push(
    `\n9. Count of people scored in the past 24hrs: ${scoresInPast24}`,
  );

  return {
    context: context.join("\n"),
    followersCount,
    startedFansCount,
    recentScore,
    scoresInPast24,
    topScore,
    mostPlayedFan,
    streamsCount,
    usersInPast7,
  };
};

export default getChatContext;
