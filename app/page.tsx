import HomePage from "@/components/Home/HomePage";
import generateUUID from "@/lib/generateUUID";
import { getMessages } from "@/lib/messages/getMessages";

export const dynamic = "force-dynamic";

interface ChatPageProps {
  searchParams?: { q?: string };
}

export default async function Home({ searchParams }: ChatPageProps) {
  const id = generateUUID();
  const initialMessage = searchParams?.q || "";
  const initialMessages = getMessages(initialMessage);

  return <HomePage id={id} initialMessages={initialMessages} />;
}
