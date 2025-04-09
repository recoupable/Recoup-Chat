import { getRoomReports } from "@/lib/supabase/getRoomReports";
import { Chat } from "@/components/VercelChat/chat";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function InstantChatRoom({ params }: PageProps) {
  const { roomId } = await params;
  console.log(`[InstantChatRoom] Fetching reports for roomId: ${roomId}`);

  const reports = await getRoomReports(roomId);
  console.log(`[InstantChatRoom] Reports result:`, reports);

  return (
    <div className="flex flex-col size-full items-center">
      <Chat roomId={roomId} reportId={reports?.report_id} />
    </div>
  );
}
