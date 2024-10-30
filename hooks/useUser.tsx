import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Address } from "viem";

const useUser = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;
  const email = user?.email?.address;
  const [userData, setUserData] = useState<any>(null);

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
      const [emailResponse, accountResponse] = await Promise.all([
        fetch("/api/email", config),
        fetch("/api/account", config),
      ]);

      if (!emailResponse.ok) {
        throw new Error(
          `Email API request failed with status: ${emailResponse.status}`,
        );
      }

      if (!accountResponse.ok) {
        throw new Error(
          `Account API request failed with status: ${accountResponse.status}`,
        );
      }

      const data = await accountResponse.json();
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
  };
};

export default useUser;
