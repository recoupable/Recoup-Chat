import { SOCIAL_LINK } from "@/types/Agent";
import { ArtistRecord } from "@/types/Artist";

const getExistingHandles = (artist: ArtistRecord | null) => {
  if (!artist) return null;

  const socials = artist.artist_social_links.filter(
    (link: SOCIAL_LINK) => link.type !== "YOUTUBE" && link.type !== "APPLE",
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handles: any = {};

  socials.map((social: SOCIAL_LINK) => {
    const lastSlashIndex = social.link.lastIndexOf("/");
    handles[`${social.type.toLowerCase()}`] = social.link
      .slice(lastSlashIndex + 1)
      .replaceAll("@", "");
  });

  return handles;
};

export default getExistingHandles;
