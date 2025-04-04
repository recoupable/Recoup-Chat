"use client";

import { InstantChatProvider } from "@/providers/InstantChatProvider";

export default function InstantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <InstantChatProvider>{children}</InstantChatProvider>
    </div>
  );
}
