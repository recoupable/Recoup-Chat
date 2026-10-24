import { Chat } from "@/components/VercelChat/chat";
import { isChatIntelligentUIEnabled } from "@/lib/intelligent-ui/chat/isChatIntelligentUIEnabled";

interface SessionChatPageProps {
  params: Promise<{ sessionId: string; chatId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SessionChatPage({
  params,
  searchParams,
}: SessionChatPageProps) {
  const { sessionId, chatId } = await params;
  const catalogId = isChatIntelligentUIEnabled()
    ? (await searchParams)?.catalogId
    : undefined;

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={chatId} sessionId={sessionId} catalogId={catalogId} />
    </div>
  );
}
