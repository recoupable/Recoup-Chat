import { Suspense } from "react";
import { getSegmentRoom } from "@/lib/supabase/getSegmentRoom";
import SegmentPage from "@/components/Segment/SegmentPage";
import { Skeleton } from "@/components/ui/skeleton";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { createSegmentRoom } from "@/lib/supabase/createSegmentRoom";
import { getSegmentWithArtist } from "@/lib/supabase/getSegmentWithArtist";

interface PageProps {
  params: {
    segmentId: string;
  };
}

export default async function Page({ params }: PageProps) {
  try {
    // First check if segment room exists
    const segmentRoom = await getSegmentRoom(params.segmentId);
    console.log("Existing segment room:", segmentRoom);
    if (segmentRoom) {
      return (
        <Suspense
          fallback={
            <div className="max-w-screen min-h-screen p-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          }
        >
          <SegmentPage segmentRoom={segmentRoom} isLoading={false} />
        </Suspense>
      );
    }

    // Get segment details and artist account ID
    const {
      segment,
      artistAccountId,
      error: segmentError,
    } = await getSegmentWithArtist(params.segmentId);

    if (segmentError || !segment) {
      throw new Error(segmentError?.message || "Failed to fetch segment");
    }

    if (!artistAccountId) {
      throw new Error("Artist account not found for segment");
    }

    console.log("Found segment:", {
      id: segment.id,
      name: segment.name,
      artistAccountId,
    });

    // Create a new room
    const { new_room, error: roomError } = await createRoomWithReport({
      account_id: artistAccountId,
      topic: `Segment: ${segment.name}`,
    });

    if (roomError || !new_room) {
      throw new Error(roomError?.message || "Failed to create room");
    }

    console.log("Created room:", { id: new_room.id });

    // Create segment room record
    const newSegmentRoom = await createSegmentRoom({
      segment_id: params.segmentId,
      room_id: new_room.id,
    });

    console.log("Created segment room:", newSegmentRoom);

    return (
      <Suspense
        fallback={
          <div className="max-w-screen min-h-screen p-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        }
      >
        <SegmentPage segmentRoom={newSegmentRoom} isLoading={false} />
      </Suspense>
    );
  } catch (e) {
    console.error("Error in segment page:", e);
    return (
      <SegmentPage
        segmentRoom={null}
        error={e instanceof Error ? e.message : "An unexpected error occurred"}
      />
    );
  }
}
