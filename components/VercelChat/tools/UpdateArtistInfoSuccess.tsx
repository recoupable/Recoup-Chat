import { UpdateAccountInfoResult } from "@/lib/tools/updateAccountInfo";
import React from "react";
import ArtistHeroSection from "./ArtistHeroSection";
import CustomInstructionsSection from "./CustomInstructionsSection";
import KnowledgeBaseSection from "./KnowledgeBaseSection";
import { Knowledge } from "@/lib/supabase/artist/updateArtistProfile";
import { CheckCircle } from "lucide-react";

interface UpdateArtistInfoSuccessProps {
  result: UpdateAccountInfoResult;
}

const UpdateArtistInfoSuccess: React.FC<UpdateArtistInfoSuccessProps> = ({
  result,
}) => {
  const { artistProfile, message } = result;

  if (!artistProfile) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="text-white font-medium">{message}</span>
        </div>
      </div>
    );
  }

  // Type guard for knowledges
  const knowledges = Array.isArray(artistProfile.knowledges)
    ? (artistProfile.knowledges as unknown as Knowledge[])
    : [];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4">
      <ArtistHeroSection artistProfile={artistProfile} />

      <div className="bg-black/40 backdrop-blur-sm rounded-b-xl overflow-hidden">
        <div className="p-4 sm:p-6">
          {artistProfile.instruction && (
            <CustomInstructionsSection instruction={artistProfile.instruction} />
          )}

          {knowledges.length > 0 && (
            <KnowledgeBaseSection knowledges={knowledges} />
          )}

          {artistProfile.organization && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <span className="text-gray-300">Organization:</span>{" "}
                {artistProfile.organization}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateArtistInfoSuccess;
