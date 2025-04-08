"use client";

import { Chat } from "@/components/VercelChat/chat";
import useAutoLogin from "@/hooks/useAutoLogin";

export default function Home() {
  useAutoLogin();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat />
    </div>
  );
}
