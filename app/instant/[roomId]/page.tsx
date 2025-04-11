import { getRoomReports } from "@/lib/supabase/getRoomReports";
import { Chat } from "@/components/VercelChat/chat";
import queryMemories from "@/lib/supabase/queryMemories";
import { Message } from "ai";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function InstantChatRoom({ params }: PageProps) {
  const { roomId } = await params;
  const reports = await getRoomReports(roomId);

  // Fetch initial messages from the database
  const { data: memories } = await queryMemories(roomId, { ascending: true });

  // Transform memories into the Message format expected by the Chat component
  const initialMessages: Message[] =
    memories?.map((memory) => ({
      ...memory.content,
    })) || [];

  return (
    <div className="flex flex-col size-full items-center">
      <Chat
        id={roomId}
        reportId={reports?.report_id}
        initialMessages={initialMessages}
      />
    </div>
  );
}
