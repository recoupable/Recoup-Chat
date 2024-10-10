import { SCORE_EVENT } from "@/types/score";

const getScoresInPast24 = (scores: SCORE_EVENT[]) => {
  return scores.filter(
    (score) => score.timestamp > Date.now() - 24 * 60 * 60 * 1000,
  ).length;
};

export default getScoresInPast24;
