import { getSegmentRoom } from "@/lib/supabase/getSegmentRoom";
import { getSegmentWithArtist } from "@/lib/supabase/getSegmentWithArtist";
import { createRoomWithReport } from "@/lib/supabase/createRoomWithReport";
import { createSegmentRoom } from "@/lib/supabase/createSegmentRoom";
import createReport from "@/lib/report/createReport";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    segmentId: string;
  };
}

export default async function Page({ params }: PageProps) {
  // First check if segment room exists
  const segmentRoom = await getSegmentRoom(params.segmentId);
  console.log("Existing segment room:", segmentRoom);

  // If room exists, redirect immediately
  if (segmentRoom?.room_id) {
    redirect(`/${segmentRoom.room_id}`);
  }

  let newRoomId: string | null = null;

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
    newRoomId = new_room.id;

    // Create segment room record
    const newSegmentRoom = await createSegmentRoom({
      segment_id: params.segmentId,
      room_id: new_room.id,
    });

    console.log("Created segment room:", newSegmentRoom);
  } catch (e) {
    console.error("Error in segment page:", e);
    throw e; // Re-throw to let Next.js error boundary handle it
  }

  // Redirect after successful creation
  if (newRoomId) {
    redirect(`/${newRoomId}`);
  }

  // This should never be reached
  throw new Error("Failed to create or find room");
}
