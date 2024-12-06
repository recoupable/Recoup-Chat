import { createAccount } from "@/lib/stripe/createAccount";
import { useEffect, useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import handleError from "@/lib/handleError";
import addStripeAccountId from "@/lib/supabase/addStripeAccountId";
import { useParams } from "next/navigation";
import createAccountLink from "../lib/stripe/createAccountLink";
import { retrieveAccount } from "@/lib/stripe/retrieveAccount";

const useStripe = () => {
  const [stripeDetailSubmitted, setStripeDetailSubmitted] = useState(false);
  const { userData, email } = useUserProvider();
  const stripeAccountId = userData?.stripeAccountId;
  const [loading, setLoading] = useState(false);
  const stripeConnected = stripeDetailSubmitted && stripeAccountId;
  const { chat_id: chatId } = useParams();

  const createStripeAccount = async () => {
    setLoading(true);
    let accountId = stripeAccountId;
    if (!stripeAccountId) {
      const createData = {
        type: "standard",
        default_currency: "usd",
        business_type: "individual",
      };

      const stripeAccount = await createAccount(createData);

      const response: any = await addStripeAccountId(
        encodeURIComponent(email || ""),
        stripeAccount.id,
      );
      if (!response) {
        handleError("creation failed!");
        setLoading(false);
        return;
      }
      accountId = stripeAccount.id;
    }
    const createLinkData = {
      account: accountId,
      refresh_url: `${window.location.origin}/funnels/tiktok-account-analysis/${chatId}`,
      return_url: `${window.location.origin}/funnels/tiktok-account-analysis/${chatId}`,
      type: "account_onboarding",
    };
    const linkResponse = await createAccountLink(createLinkData);
    window.open(linkResponse.url, "_self");
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const response = await retrieveAccount(stripeAccountId);
      setStripeDetailSubmitted(response.details_submitted);
    };
    if (!stripeAccountId) return;
    init();
  }, [stripeAccountId]);

  return {
    stripeConnected,
    createStripeAccount,
    loading,
  };
};

export default useStripe;
