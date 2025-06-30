import { useArtistProvider } from "@/providers/ArtistProvider";
import { UpdateArtistSocialsResult } from "@/lib/tools/updateArtistSocials";
import ArtistHeroSection from "./ArtistHeroSection";
import { ArtistProfile } from "@/lib/supabase/artist/updateArtistProfile";
import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import getSocialPlatformByLink from "@/lib/getSocialPlatformByLink";

export interface UpdateArtistSocialsSuccessProps {
  result: UpdateArtistSocialsResult;
}

const UpdateArtistSocialsSuccess: React.FC<UpdateArtistSocialsSuccessProps> = ({
  result,
}) => {
  const { selectedArtist } = useArtistProvider();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4">
      <ArtistHeroSection
        artistProfile={selectedArtist as ArtistProfile}
        message={result.message || "Artist socials updated successfully."}
      />
      <div className="bg-black/40 backdrop-blur-sm rounded-b-xl overflow-hidden">
        <div className="p-4 sm:p-6 space-y-2">
          {result.socials?.map((social) => (
            <Link
              href={
                social.social.profile_url.startsWith("http://") || social.social.profile_url.startsWith("https://")
                  ? social.social.profile_url
                  : `https://${social.social.profile_url}`
              }
              key={social.social.id}
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-300" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {social.social.profile_url}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getSocialPlatformByLink(social.social.profile_url).toLowerCase() || 'Social Link'}
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateArtistSocialsSuccess;
