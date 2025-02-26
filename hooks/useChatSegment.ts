import { useQuery } from "@tanstack/react-query";

interface RoomSegmentResponse {
  segmentId: string | null;
  error?: string;
}

export const useChatSegment = (roomId?: string) => {
  return useQuery({
    queryKey: ["roomSegment", roomId],
    queryFn: async (): Promise<RoomSegmentResponse> => {
      if (!roomId) {
        return { segmentId: null };
      }

      const response = await fetch(`/api/roomSegment?roomId=${roomId}`);
      if (!response.ok) {
        const error = await response.json();
        console.error("[useChatSegment] API error:", {
          status: response.status,
          error,
        });
        throw new Error(error.error || "Failed to fetch segment ID");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};
