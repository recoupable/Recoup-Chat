import { getArtistSegments } from "@/lib/supabase/getArtistSegments";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");

  console.log("[Segments API] Request:", {
    artistId,
    timestamp: new Date().toISOString(),
  });

  if (!artistId) {
    console.log("[Segments API] Error: Missing artistId");
    return Response.json({ error: "artistId is required" }, { status: 400 });
  }

  try {
    const segments = await getArtistSegments(artistId);

    console.log("[Segments API] Response:", {
      artistId,
      segmentsCount: segments.length,
      segments: segments.map((s) => ({ id: s.id, name: s.name, size: s.size })),
      timestamp: new Date().toISOString(),
    });

    return Response.json(segments, { status: 200 });
  } catch (error) {
    console.error("[Segments API] Error:", {
      artistId,
      error,
      timestamp: new Date().toISOString(),
    });
    return Response.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
