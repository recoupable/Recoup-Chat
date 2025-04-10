"use client";

import { Chat } from "@/components/VercelChat/chat";
import useAutoLogin from "@/hooks/useAutoLogin";
import generateUUID from "@/lib/generateUUID";

export default function Home() {
  useAutoLogin();
  const id = generateUUID();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} />
    </div>
  );
}
