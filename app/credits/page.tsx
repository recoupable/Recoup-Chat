"use client";

import useCredits from "@/hooks/useCredits";

const CreditsPage = () => {
  useCredits();
  return (
    <div className="grow h-screen overflow-hidden w-full p-4 bg-background">
      <div className="size-full flex flex-col items-center justify-center bg-white rounded-xl">
        <p>Checking credits...</p>
      </div>
    </div>
  );
};

export default CreditsPage;
