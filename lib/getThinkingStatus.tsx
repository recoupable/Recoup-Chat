// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getThinkingStatus = (toolCall: any) => {
  if (toolCall?.toolName === "getArtistAnalysis" && toolCall?.args?.user_name) {
    return `Searching for @${toolCall?.args?.user_name || ""} videos on tiktok...`;
  }

  return "is thinking...";
};

export default getThinkingStatus;
