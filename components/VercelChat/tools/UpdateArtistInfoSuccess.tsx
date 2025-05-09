import React from "react";

export interface ArtistInfo {
  name?: string | null;
  image?: string | null;
  label?: string | null;
  instruction?: string | null;
}

interface UpdateArtistInfoSuccessProps {
  artist: ArtistInfo;
}

const UpdateArtistInfoSuccess: React.FC<UpdateArtistInfoSuccessProps> = ({
  artist,
}) => {
  return (
    <div className="rounded-lg border border-green-300 bg-green-50 p-4 flex flex-col items-center gap-2 shadow-sm">
      <div className="text-green-700 font-semibold text-lg mb-2">
        Artist Info Updated Successfully!
      </div>
      {artist.image && (
        <img
          src={artist.image}
          alt={artist.name || "Artist"}
          className="w-20 h-20 rounded-full object-cover border border-green-200 mb-2"
        />
      )}
      <div className="text-xl font-bold text-gray-900">{artist.name}</div>
      {artist.label && (
        <div className="text-sm text-gray-600">Label: {artist.label}</div>
      )}
      {artist.instruction && (
        <div className="text-xs text-gray-500 mt-2 italic">
          {artist.instruction}
        </div>
      )}
    </div>
  );
};

export default UpdateArtistInfoSuccess;
