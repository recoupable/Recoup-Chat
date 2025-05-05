import React, { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import Image from "next/image";
import { useVercelChatContext } from "@/providers/VercelChatProvider";

/**
 * Client function to copy messages between rooms
 */
async function copyMessagesApi(
  sourceRoomId: string,
  targetRoomId: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/memories/copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceRoomId,
        targetRoomId,
        clearExisting: false,
      }),
    });

    if (!response.ok) {
      console.error("Failed to copy messages:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error copying messages:", error);
    return false;
  }
}

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
  const { getArtists } = useArtistProvider();
  const { status, id } = useVercelChatContext();

  useEffect(() => {
    // Function to refresh artists list and select the new artist
    const refreshAndSelect = async () => {
      console.log("refreshAndSelect - result", result);
      if (!result.artist || !result.artist.account_id) {
        return;
      }

      console.log("refreshAndSelect - newRoomId", result.newRoomId);
      console.log("refreshAndSelect - status", status);

      // Step 1: Refresh the artists list
      await getArtists(result.artist.account_id);

      const needsRedirect = id !== result.newRoomId;
      console.log("refreshAndSelect - needsRedirect", needsRedirect);
      const isFinishedStreaming = status === "ready";
      console.log(
        "refreshAndSelect - isFinishedStreaming",
        isFinishedStreaming
      );

      if (needsRedirect && isFinishedStreaming && result.roomId) {
        console.log(
          "Copying messages from",
          result.roomId,
          "to",
          result.newRoomId
        );

        // Copy messages from current room to the newly created room
        const success = await copyMessagesApi(
          result.roomId,
          result.newRoomId as string
        );

        if (success) {
          window.history.replaceState({}, "", `/chat/${result.newRoomId}`);

          console.log("Messages copied successfully, redirecting to new room");
        } else {
          console.error("Failed to copy messages");
        }
      }
    };

    // Call the refresh function when the status changes
    refreshAndSelect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

      <div>
        <p className="font-medium">{result.artist.name}</p>
        <p className="text-sm text-green-600">Artist created successfully</p>
      </div>
    </div>
  );
}

export default CreateArtistToolResult;
