import { Chat } from "@/components/VercelChat/chat";
import generateUUID from "@/lib/generateUUID";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const id = generateUUID();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} />
    </div>
  );
}
