import { SCORE_EVENT } from "@/types/score";

const getRecentScore = (scores: SCORE_EVENT[]) => {
  return scores.sort((a, b) => b.timestamp - a.timestamp)[0];
};

export default getRecentScore;
