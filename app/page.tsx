"use client";

import AIError from "@/components/Chat/AIError";
import InitialChat from "@/components/Chat/InitialChat";
import { useChatProvider } from "@/providers/ChatProvider";

const LandingPage = () => {
  const { quotaExceeded } = useChatProvider();
  return <>{quotaExceeded ? <AIError /> : <InitialChat />}</>;
};

export default LandingPage;
