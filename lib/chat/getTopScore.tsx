import { SCORE_EVENT } from "@/types/score";

const getTopScore = (scores: SCORE_EVENT[]) => {
  return scores.sort((a, b) => a.points - b.points)[0]
};

export default getTopScore;
