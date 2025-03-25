import { getRoomReports } from "@/lib/supabase/getRoomReports";
import Chat from "@/components/Chat";

interface PageProps {
  params: Promise<{
    chat_id: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { chat_id } = await params;
  const reports = await getRoomReports(chat_id);
  return <Chat reportId={reports?.report_id} />;
}
