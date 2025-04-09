import { getRoomReports } from "@/lib/supabase/getRoomReports";
import { Chat } from "@/components/VercelChat/chat";

interface PageProps {
  params: Promise<{
    chat_id: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { chat_id } = await params;
  // Fetching reports for future implementation
  const reports = await getRoomReports(chat_id);

  return (
    <div className="flex flex-col size-full items-center">
      <Chat roomId={chat_id} />
    </div>
  );
}
