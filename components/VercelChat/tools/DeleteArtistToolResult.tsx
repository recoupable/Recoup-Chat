import React from "react";
import { DeleteArtistResult } from "@/lib/tools/deleteArtist";
import { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";

/**
 * Props for the DeleteArtistToolResult component
 */
interface DeleteArtistToolResultProps {
  result: DeleteArtistResult;
}

/**
 * Component that displays the result of the delete_artist tool
 * Also handles refreshing the artist list after deletion
 */
export function DeleteArtistToolResult({
  result,
}: DeleteArtistToolResultProps) {
  const { getArtists } = useArtistProvider();

  useEffect(() => {
    // If the deletion was successful, refresh the artist list
    if (result.success) {
      // Refresh the artist list
      getArtists();
    }
  }, [result.success, getArtists]);

  // If there's an error, show error state
  if (!result.success) {
    return (
      <div className="flex items-center space-x-4 p-3 rounded-md bg-red-50 border border-red-200 my-2">
        <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
          <span className="text-lg font-bold text-red-600">!</span>
        </div>
        <div>
          <p className="font-medium">Artist Deletion Failed</p>
          <p className="text-sm text-red-600">
            {result.error || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Calculate the display name for the artist
  const artistDisplay = result.artistName ? `"${result.artistName}"` : "Artist";

  return (
    <div className="flex items-center space-x-4 p-3 rounded-md bg-green-50 border border-green-200 my-2">
      <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
        <span className="text-lg font-bold text-green-600">✓</span>
      </div>
      <div>
        <p className="font-medium">{artistDisplay} Deleted Successfully</p>
        <p className="text-sm text-green-600">{result.message}</p>
      </div>
    </div>
  );
}

export default DeleteArtistToolResult;
