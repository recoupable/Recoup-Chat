import { useAccount } from "wagmi";

const MiniAppAddress = () => {
  const { isConnected, address } = useAccount();

  if (isConnected) {
    return (
      <>
        <div>You&apos;re connected!</div>
        <div>Address: {address}</div>
      </>
    );
  }
};

export default MiniAppAddress;
