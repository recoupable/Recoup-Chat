import { getRoomReports } from "@/lib/supabase/getRoomReports";
import Chat from "@/components/Chat";
interface PageProps {
  params: {
    chat_id: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const reports = await getRoomReports(params.chat_id);
  return <Chat reportId={reports?.report_id} />;
}
