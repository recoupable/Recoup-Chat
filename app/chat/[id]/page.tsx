import { notFound } from "next/navigation";
import { Chat } from "@/components/VercelChat/chat";
import { Message } from "ai";
import getRoom from "@/lib/supabase/getRoom";
import queryMemories from "@/lib/supabase/queryMemories";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getRoom(id);

  if (!chat) {
    notFound();
  }

  // Fetch initial messages from the database
  const { data: memories } = await queryMemories(id, { ascending: true });

  // Transform memories into the Message format expected by the Chat component
  const initialMessages: Message[] =
    memories?.map((memory) => ({
      ...memory.content,
    })) || [];

  return (
    <>
      <Chat id={id} initialMessages={initialMessages} />
    </>
  );
}
