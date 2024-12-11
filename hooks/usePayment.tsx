import { useState } from "react";
import { toast } from "react-toastify";
import { createPrice } from "@/lib/stripe/createPrice";
import { createSession } from "@/lib/stripe/createSession";
import { v4 as uuidV4 } from "uuid";
import { useParams } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { chat_id: chatId } = useParams();
  const { userData } = useUserProvider();

  const createCheckoutSession = async (
    productName: string,
    successUrl: string,
    segmentName: string,
  ) => {
    const priceResponse = await createPrice(productName);

    if (priceResponse.error) {
      toast.error("price creation is failed.");
      return false;
    }

    const referenceId = uuidV4();
    const sessionResponse = await createSession(
      `${successUrl}?referenceId=${referenceId}&segmentName=${segmentName}`,
      priceResponse.id,
      referenceId,
      chatId as string,
      userData?.id,
    );

    window.open(sessionResponse.url, "_self");
  };

  return {
    loading,
    setLoading,
    createCheckoutSession,
  };
};

export default usePayment;
