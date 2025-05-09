import { UpdateAccountInfoResult } from "@/lib/tools/updateAccountInfo";
import React from "react";
import GenericSuccess from "./GenericSuccess";

interface UpdateArtistInfoSuccessProps {
  result: UpdateAccountInfoResult;
}

const UpdateArtistInfoSuccess: React.FC<UpdateArtistInfoSuccessProps> = ({
  result,
}) => {
  const { artistProfile } = result;
  return (
    <GenericSuccess
      image={artistProfile?.image || ""}
      name={artistProfile?.name || ""}
      message="Artist Info Updated Successfully!"
    >
      {artistProfile?.label && (
        <div className="text-xs text-gray-500 mt-1 italic text-start">
          Label: {artistProfile?.label}
        </div>
      )}
      {artistProfile?.instruction && (
        <div className="text-xs text-gray-500 mt-1 italic text-start">
          Custom Instructions: {artistProfile?.instruction}
        </div>
      )}
    </GenericSuccess>
  );
};

export default UpdateArtistInfoSuccess;
