// Function to get platform color based on URL
export function getPlatformColor(url: string): string {
  if (url.includes("spotify")) {
    return "bg-[#1DB954]/10 border-[#1DB954]/20";
  } else if (url.includes("instagram")) {
    return "bg-gradient-to-br from-[#FCAF45]/10 via-[#E1306C]/10 to-[#5851DB]/10 border-[#E1306C]/20";
  } else if (url.includes("twitter") || url.includes("x.com")) {
    return "bg-[#1DA1F2]/10 border-[#1DA1F2]/20";
  } else if (url.includes("facebook")) {
    return "bg-[#4267B2]/10 border-[#4267B2]/20";
  } else if (url.includes("youtube")) {
    return "bg-[#FF0000]/10 border-[#FF0000]/20";
  } else if (url.includes("tiktok")) {
    return "bg-[#000000]/10 border-[#000000]/20";
  } else {
    return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
  }
}
