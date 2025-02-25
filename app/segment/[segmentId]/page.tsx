import { Suspense } from "react";
import { getSegmentRoom } from "@/lib/supabase/getSegmentRoom";
import { Skeleton } from "@/components/ui/skeleton";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { createSegmentRoom } from "@/lib/supabase/createSegmentRoom";
import { getSegmentWithArtist } from "@/lib/supabase/getSegmentWithArtist";
import createReport from "@/lib/report/createReport";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    segmentId: string;
  };
}

export default async function Page({ params }: PageProps) {
  // First check if segment room exists - outside try-catch
  const segmentRoom = await getSegmentRoom(params.segmentId);
  console.log("Existing segment room:", segmentRoom);

  // Redirect immediately if room exists
  if (segmentRoom) {
    redirect(`/${segmentRoom.room_id}`);
  }

  try {
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

    // Generate report first
    const reportId = await createReport(segment.id);
    if (!reportId) {
      throw new Error("Failed to generate segment report");
    }

    console.log("Generated report:", { reportId });

    // Create a new room with the report
    const { new_room, error: roomError } = await createRoomWithReport({
      account_id: artistAccountId,
      topic: `Segment: ${segment.name}`,
      report_id: reportId,
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

    // Redirect to chat page after creating new room
    redirect(`/${new_room.id}`);
  } catch (e) {
    console.error("Error in segment page:", e);
    return (
      <Suspense
        fallback={
          <div className="max-w-screen min-h-screen p-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        }
      >
        <div className="max-w-screen min-h-screen p-4">
          <div className="text-red-500">
            Error:{" "}
            {e instanceof Error ? e.message : "An unexpected error occurred"}
          </div>
        </div>
      </Suspense>
    );
  }
}
