import { Chat } from "@/components/VercelChat/chat";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function InstantChatRoom({ params }: PageProps) {
  const { roomId } = params;

  return (
    <div className="flex flex-col size-full items-center">
      <Chat roomId={roomId} />
    </div>
  );
}
