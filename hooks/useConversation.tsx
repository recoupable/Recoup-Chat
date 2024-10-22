import { useParams } from "next/navigation";
import { useRef } from "react";

const useConverstaion = () => {
  const { conversation } = useParams();
  const conversationRef = useRef(conversation as string);

  return {
    conversationRef,
    conversationId: conversation,
  };
};

export default useConverstaion;
