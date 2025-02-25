import { getRoomReports } from "@/lib/supabase/getRoomReports";
import ChatPageClient from "./ChatPageClient";

interface PageProps {
  params: {
    chat_id: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const reports = await getRoomReports(params.chat_id);
  console.log("Room reports:", { chat_id: params.chat_id, reports });

  return <ChatPageClient reportId={reports?.report_id} />;
}
