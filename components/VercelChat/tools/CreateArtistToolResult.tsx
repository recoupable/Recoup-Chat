import React from "react";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import Image from "next/image";
import useCreateArtistTool from "@/hooks/useCreateArtistTool";

/**
 * Props for the CreateArtistToolResult component
 */
interface CreateArtistToolResultProps {
  result: CreateArtistResult;
}

/**
 * Component that displays the result of the create_new_artist tool
 * Also handles refreshing the artist list and selecting the new artist
 */
export function CreateArtistToolResult({
  result,
}: CreateArtistToolResultProps) {
  const { isProcessing, error: processingError } = useCreateArtistTool(result);

  // If there's an error or no artist data, show error state
  if (!result.artist) {
    return (
      <div className="flex items-center space-x-4 p-3 rounded-md bg-red-50 border border-red-200 my-2">
        <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
          <span className="text-lg font-bold text-red-600">!</span>
        </div>
        <div>
          <p className="font-medium">Artist Creation Failed</p>
          <p className="text-sm text-red-600">
            {result.error || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-3 rounded-md bg-green-50 border border-green-200 my-2">
      {/* Artist avatar - use image if available, otherwise a placeholder */}
      <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
        {result.artist.image ? (
          <Image
            src={result.artist.image}
            alt={result.artist.name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-green-600">
            {result.artist.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-grow">
        <p className="font-medium">{result.artist.name}</p>
        <p className="text-sm text-green-600">
          {isProcessing
            ? "Setting up artist conversation..."
            : processingError
              ? `Created successfully but: ${processingError}`
              : "Artist created successfully"}
        </p>
      </div>
    </div>
  );
}

export default CreateArtistToolResult;
