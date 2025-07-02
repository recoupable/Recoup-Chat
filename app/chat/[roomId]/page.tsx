import { getRoomReports } from "@/lib/supabase/getRoomReports";
import { Chat } from "@/components/VercelChat/chat";
import generateUUID from "@/lib/generateUUID";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Creates YouTube OAuth continuation messages compatible with the Chat component
 */
function createYouTubeOAuthMessages(searchParams?: { [key: string]: string | string[] | undefined }) {
  if (!searchParams) {
    return [];
  }

  const youtubeAuth = searchParams.youtube_auth;
  const youtubeAuthError = searchParams.youtube_auth_error;

  // Handle successful YouTube authentication
  if (youtubeAuth === "success") {
    return [
      {
        id: generateUUID(),
        role: "user" as const,
        content: "Great! I've successfully connected my YouTube account. Please continue with what you were helping me with.",
      },
    ];
  }

  // Handle YouTube authentication error
  if (youtubeAuthError) {
    const errorMessage = Array.isArray(youtubeAuthError) ? youtubeAuthError[0] : youtubeAuthError;
    return [
      {
        id: generateUUID(),
        role: "user" as const,
        content: `I encountered an issue while connecting my YouTube account: ${decodeURIComponent(errorMessage)}. Can you help me try connecting again?`,
      },
    ];
  }

  // No OAuth parameters found
  return [];
}

export default async function InstantChatRoom({ params, searchParams }: PageProps) {
  const { roomId } = await params;
  const reports = await getRoomReports(roomId);
  
  // Handle YouTube OAuth continuation
  const searchParamsResolved = await searchParams;
  const initialMessages = createYouTubeOAuthMessages(searchParamsResolved);

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={roomId} reportId={reports?.report_id} initialMessages={initialMessages} />
    </div>
  );
}
