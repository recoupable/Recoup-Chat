import React from "react";
import { CheckCircle, Calendar } from "lucide-react";
import { formatDate } from "date-fns";
import { ArtistProfile } from "@/lib/supabase/artist/updateArtistProfile";

const ArtistHeroSection = ({
  artistProfile,
}: {
  artistProfile: ArtistProfile;
}) => {
  return (
    <div className="relative">
      {artistProfile.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${artistProfile.image})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          {artistProfile.image && (
            <div className="flex-shrink-0">
              {/* eslint-disable */}
              <img
                src={artistProfile.image}
                alt={artistProfile.name || "Artist"}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-2xl"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              {artistProfile.name}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-400 text-sm font-medium">
                Profile Updated Successfully!
              </span>
            </div>

            {artistProfile.label && (
              <div className="text-sm text-gray-300 mb-2">
                <span className="text-gray-400">Label:</span>{" "}
                {artistProfile.label}
              </div>
            )}

            {artistProfile.updated_at && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>
                  Updated{" "}
                  {formatDate(
                    new Date(artistProfile.updated_at),
                    "MMM d, yyyy, h:mm a"
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeroSection;
