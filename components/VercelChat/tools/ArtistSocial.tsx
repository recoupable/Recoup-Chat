import { Social as SocialType } from "@/types/spotify";
import Link from "next/link";
import ArtistSocialDisplayText from "./ArtistSocialDisplayText";

export const ArtistSocial = ({ social }: { social: SocialType }) => {
  const platform = social.profile_url.split("/")[0].split(".")[0]
  return (
    <Link
      key={social.id}
      href={`https://${social.profile_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-start p-4 border rounded-xl transition-all hover:shadow-md hover:scale-[1.02]`}
    >
      <span className="text-sm font-medium capitalize mb-1">{platform}</span>
      <ArtistSocialDisplayText social={social} />
    </Link>
  );
};
