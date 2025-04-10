"use client";

import { Chat } from "@/components/VercelChat/chat";
import useAutoLogin from "@/hooks/useAutoLogin";
import { generateUUID } from "@/lib/utils";

export default function Home() {
  useAutoLogin();
  const roomId = generateUUID();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat roomId={roomId} />
    </div>
  );
}
