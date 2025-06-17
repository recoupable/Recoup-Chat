import spotifyLogo from "@/public/brand-logos/spotify.png";
import instagramLogo from "@/public/brand-logos/instagram.png";
import xLogo from "@/public/brand-logos/x.png";
import facebookLogo from "@/public/brand-logos/facebook.png";
import youtubeLogo from "@/public/brand-logos/youtube.png";
import tiktokLogo from "@/public/brand-logos/tiktok.png";

// Function to get social media logo based on URL
export function getSocialLogo(url: string): string {
  if (url.includes("spotify")) {
    return spotifyLogo.src;
  } else if (url.includes("instagram")) {
    return instagramLogo.src;
  } else if (url.includes("twitter") || url.includes("x.com")) {
    return xLogo.src;
  } else if (url.includes("facebook")) {
    return facebookLogo.src;
  } else if (url.includes("youtube")) {
    return youtubeLogo.src;
  } else if (url.includes("tiktok")) {
    return tiktokLogo.src;
  } else {
    return "https://cdn-icons-png.flaticon.com/512/3059/3059997.png"; // Generic social icon
  }
}
