// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getThinkingStatus = (context: any, toolName: any) => {
  if (toolName === "getArtistAnalysis") {
    return `Searching for @${context?.userName || ""} videos on tiktok...`;
  }

  return "is thinking...";
};

export default getThinkingStatus;
