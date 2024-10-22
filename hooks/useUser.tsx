import { usePrivy } from "@privy-io/react-auth";
import { Address } from "viem";

const useUser = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;

  return {
    address,
    login,
  };
};

export default useUser;
