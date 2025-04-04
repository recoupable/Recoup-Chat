"use client";

import InitialChat from "@/components/Chat/InitialChat";

const NewChatPage = () => {
  // Always render InitialChat immediately, never show skeleton
  return <InitialChat />;
};

export default NewChatPage;
