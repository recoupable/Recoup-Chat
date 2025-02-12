import { SOCIAL } from "@/types/Agent";
import { ArtistRecord } from "@/types/Artist";

const getExistingHandles = (artist: ArtistRecord | null) => {
  if (!artist)
    return {
      twitter: "",
      spotify: "",
      tiktok: "",
      instagram: "",
    };

  const socials = artist.account_socials.filter(
    (link: SOCIAL) => link?.type !== "YOUTUBE" && link?.type !== "APPLE"
  );

  // Initialize with empty handles
  const handles: Record<string, string> = {
    twitter: "",
    spotify: "",
    tiktok: "",
    instagram: "",
  };

  socials.forEach((social: SOCIAL) => {
    const link = social.link;
    const type = social.type.toLowerCase();

    if (type === "spotify") {
      // Handle various Spotify URL formats
      const spotifyMatches = [
        // Format: /artist/id
        link.match(/\/artist\/([a-zA-Z0-9]+)\/?$/),
        // Format: /artists/id
        link.match(/\/artists\/([a-zA-Z0-9]+)\/?$/),
        // Format: user/id
        link.match(/\/user\/([a-zA-Z0-9]+)\/?$/),
      ];
      const match = spotifyMatches.find((m) => m !== null);
      handles[type] = match ? match[1] : "";
    } else {
      // For other platforms, extract username from URL
      const match = link.match(/\/\/[^/]+\/([^\/?#]+)/);
      handles[type] = match ? match[1] : "";
    }
  });

  return handles;
};

export default getExistingHandles;
