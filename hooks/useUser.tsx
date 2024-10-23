import { usePrivy } from "@privy-io/react-auth";
import { Address } from "viem";

const useUser = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }

    return true;
  };

  return {
    address,
    login,
    isPrepared,
  };
};

export default useUser;
