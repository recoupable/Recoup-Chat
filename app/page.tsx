"use client";

import { Chat } from "@/components/VercelChat/chat";
import useAutoLogin from "@/hooks/useAutoLogin";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";

const HomePage = () => {
  useFirstArtistRedirect();
  useAutoLogin();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat />
    </div>
  );
};

export default HomePage;
