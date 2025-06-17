export const getYoutubeChannelNameFromURL = (url: string) => {
  let youtubeChannelName = "";
  const urlParts = url.split("/");
  youtubeChannelName = urlParts[urlParts.length - 1] || "";
  if (youtubeChannelName.startsWith("c/")) {
    youtubeChannelName = youtubeChannelName.substring(2);
  } else if (youtubeChannelName.startsWith("@")) {
    youtubeChannelName = youtubeChannelName.substring(1);
  }
  return `@${youtubeChannelName}`;
};
