"use client";

import Chat from "@/components/Chat";

interface ChatPageClientProps {
  reportId?: string;
}

export default function ChatPageClient({ reportId }: ChatPageClientProps) {
  return <Chat reportId={reportId} />;
}
