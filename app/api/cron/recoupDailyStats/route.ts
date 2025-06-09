import { NextResponse } from "next/server";
import { getRooms } from "@/lib/supabase/rooms/getRooms";
import { getMemories } from "@/lib/supabase/memories/getMemories";

export async function GET() {
  const now = Date.now();
  const startDate = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const prevStartDate = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const [rooms, prevRooms, memories, prevMemories] = await Promise.all([
      getRooms({ startDate }),
      getRooms({ startDate: prevStartDate, endDate: startDate }),
      getMemories({ startDate }),
      getMemories({ startDate: prevStartDate, endDate: startDate }),
    ]);
    return NextResponse.json(
      {
        newRoomsCount: rooms.length,
        prevRoomsCount: prevRooms.length,
        roomsDelta:
          ((rooms.length - prevRooms.length) / prevRooms.length) * 100,
        newMemoriesCount: memories.length,
        prevMemoriesCount: prevMemories.length,
        memoriesDelta:
          ((memories.length - prevMemories.length) / prevMemories.length) * 100,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
