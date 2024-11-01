import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Address } from "viem";
import useTrackEmail from "./useTrackEmail";

const useUser = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;
  const email = user?.email?.address;
  const [userData, setUserData] = useState<any>(null);
  const { trackId } = useTrackEmail();

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }

    return true;
  };

  useEffect(() => {
    const init = async () => {
      const config = {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("/api/account", config);

      if (!response.ok) {
        throw new Error(
          `Email API request failed with status: ${response.status}`,
        );
      }

      const data = await response.json();
      setUserData(data);
    };
    if (!email) return;
    init();
  }, [email]);

  return {
    address,
    email,
    login,
    isPrepared,
    userData,
    trackId,
  };
};

export default useUser;
