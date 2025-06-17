import { ArtistSocialsResultType } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";
import spotifyLogo from "@/public/brand-logos/spotify.png";

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
        <Image src={spotifyLogo.src} alt="Spotify Logo" width={20} height={20} />
        <h3 className="font-semibold">Spotify Deep Research Complete</h3>
      </div>
      
      {result.artistSocials && result.artistSocials.socials.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Artist Socials</h4>
            <span className="text-xs text-gray-500">
              {result.artistSocials.socials.length} {result.artistSocials.socials.length === 1 ? 'platform' : 'platforms'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {result.artistSocials.socials.map((social) => {
              const platform = social.profile_url.split("/")[0].split(".")[0];
              const displayName = platform === "open" ? "spotify" : platform;

              return (
                <Link
                  key={social.id}
                  href={`https://${social.profile_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-start p-4 border rounded-xl transition-all hover:shadow-md hover:scale-[1.02]`}
                >
                  <span className="text-sm font-medium capitalize mb-1">
                    {displayName}
                  </span>
                  {social.username && social.username.length > 0 ? (
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-full">
                      {social.username.startsWith('@') ? social.username : `@${social.username}`}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 truncate max-w-full">
                      {social.profile_url}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
