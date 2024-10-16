import { SCORE_EVENT } from "@/types/score";

const getScoreContext = (score: SCORE_EVENT) => {
  return `{ username: "${score.metadata.username}", timeToGetScore(Time taken to get a score): ${score.metadata.time}, fanId: "${score.metadata.userId}", score: ${score.points}, playedAt(or recordedAt): ${new Date(score.timestamp).toDateString()}}`;
};

export default getScoreContext;
