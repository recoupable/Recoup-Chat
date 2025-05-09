import { UpdateAccountInfoResult } from "@/lib/tools/updateAccountInfo";
import React from "react";

interface UpdateArtistInfoSuccessProps {
  result: UpdateAccountInfoResult;
}

const UpdateArtistInfoSuccess: React.FC<UpdateArtistInfoSuccessProps> = ({
  result,
}) => {
  const { artistProfile } = result;
  return (
    <div className="rounded-lg border border-green-300 bg-green-50 p-4 flex flex-col items-center gap-2 shadow-sm max-w-md mx-auto">
      <div className="text-green-700 font-semibold text-base mb-1">
        Artist Info Updated Successfully!
      </div>
      <div className="flex items-center gap-3 w-full justify-center">
        {artistProfile?.image && (
          <img
            src={artistProfile.image}
            alt={artistProfile.name || "Artist"}
            className="w-12 h-12 rounded-full object-cover border border-green-200"
          />
        )}
        <span className="text-lg font-bold text-gray-900 truncate">
          {artistProfile?.name}
        </span>
      </div>
      {artistProfile?.label && (
        <div className="text-xs text-gray-600 mt-1">
          Label: {artistProfile.label}
        </div>
      )}
      {artistProfile?.instruction && (
        <div className="text-xs text-gray-500 mt-1 italic text-center">
          {artistProfile.instruction}
        </div>
      )}
    </div>
  );
};

export default UpdateArtistInfoSuccess;
