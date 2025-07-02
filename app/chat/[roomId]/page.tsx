import { getRoomReports } from "@/lib/supabase/getRoomReports";
import { Chat } from "@/components/VercelChat/chat";
import { getYouTubeOAuthContinuationMessage } from "@/lib/youtube/getYouTubeOAuthContinuationMessage";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InstantChatRoom({ params, searchParams }: PageProps) {
  const { roomId } = await params;
  const reports = await getRoomReports(roomId);
  
  // Handle YouTube OAuth continuation
  const searchParamsResolved = await searchParams;
  const initialMessages = getYouTubeOAuthContinuationMessage(searchParamsResolved) as any;

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={roomId} reportId={reports?.report_id} initialMessages={initialMessages} />
    </div>
  );
}
