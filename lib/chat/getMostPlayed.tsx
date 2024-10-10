import { SCORE_EVENT } from "@/types/score";

const getMostPlayed = (scores: SCORE_EVENT[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usernameCount = {} as any;

  scores.forEach((score) => {
    const username = score.metadata.username;
    if (!usernameCount[username]) {
      usernameCount[username] = 0;
    }
    usernameCount[username]++;
  });

  let maxCount = 0;
  let mostPlayedFan = "";

  for (const username in usernameCount) {
    if (usernameCount[username] > maxCount) {
      maxCount = usernameCount[username];
      mostPlayedFan = username;
    }
  }

  return mostPlayedFan;
};

export default getMostPlayed;
