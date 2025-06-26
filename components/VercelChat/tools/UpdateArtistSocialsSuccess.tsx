import React from "react";
import GenericSuccess from "./GenericSuccess";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { UpdateArtistSocialsResult } from "@/lib/tools/updateArtistSocials";

export interface UpdateArtistSocialsSuccessProps {
  result: UpdateArtistSocialsResult;
}

const UpdateArtistSocialsSuccess: React.FC<UpdateArtistSocialsSuccessProps> = ({
  result,
}) => {
  const { selectedArtist } = useArtistProvider();

  return (
    <GenericSuccess
      name={selectedArtist?.name || "Artist"}
      image={selectedArtist?.image || ""}
      message={result.message || "Artist socials updated successfully."}
    >
      <div className="text-xs text-gray-500 mt-1 italic text-start">
        {result.socials?.map((social) => social.social.profile_url).join(", ")}
      </div>
    </GenericSuccess>
  );
};

export default UpdateArtistSocialsSuccess;
