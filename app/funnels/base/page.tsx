"use client";

import { StartButton } from "@/components/shared/StartButton";

export default function BaseFunnel() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Launchpad for AI Agents on Base
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Deploy your own AI agent on Base in seconds. Perfect for musicians,
          creators, and artists looking to engage with their audience through
          intelligent, automated interactions.
        </p>
      </div>
      <StartButton />
    </main>
  );
}
