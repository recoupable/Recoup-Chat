import { SCORE_EVENT } from "@/types/score";

const getTopScore = (scores: SCORE_EVENT[]) => {
  return scores.sort((a, b) => b.points - a.points)[0];
};

export default getTopScore;
