import { ArtistSocialsResultType } from "@/types/spotify";
import Image from "next/image";
import spotifyLogo from "@/public/brand-logos/spotify.png";
import { Social } from "./ArtistSocial";

export default function SpotifyDeepResearchResultComponent({
  result,
}: {
  result: ArtistSocialsResultType;
}) {
  if (!result.success) {
    return (
      <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
        <span>Spotify deep research failed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-5 border rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-sm">
      <div className="flex items-center gap-2 text-primary border-b pb-3">
        <Image
          src={spotifyLogo.src}
          alt="Spotify Logo"
          width={20}
          height={20}
        />
        <h3 className="font-semibold">Spotify Deep Research Complete</h3>
      </div>

      {result.artistSocials && result.artistSocials.socials.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Artist Socials
            </h4>
            <span className="text-xs text-gray-500">
              {result.artistSocials.socials.length}{" "}
              {result.artistSocials.socials.length === 1
                ? "platform"
                : "platforms"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {result.artistSocials.socials.map((social) => (
              <Social key={social.id} social={social} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
