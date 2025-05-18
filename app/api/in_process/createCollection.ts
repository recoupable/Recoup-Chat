import { inProcessProtocolAbi } from "@/abi/inProcessProtocolAbi";
import { IN_PROCESS_PROTOCOL_ADDRESS, IS_PROD } from "@/lib/consts";
import { CdpClient } from "@coinbase/cdp-sdk";
import { encodeFunctionData } from "viem";

// Main function to create a collection
async function createCollection(collectionName: string) {
  // Initialize CDP client with your credentials
  const cdp = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
    walletSecret: process.env.CDP_WALLET_SECRET,
  });

  // Create a new account
  const evmAccount = await cdp.evm.createAccount();

  // Create a smart account (contract wallet)
  const smartAccount = await cdp.evm.createSmartAccount({
    owner: evmAccount,
  });

  // Collection details
  const contractUri = "ar://contractUri"; // Your contract metadata URI

  // Royalty configuration
  const royaltyConfig = {
    royaltyMintSchedule: 0,
    royaltyBPS: 0, // 0% royalties (set to 1000 for 10%)
    royaltyRecipient: smartAccount.address,
  };

  // Encode the function call data
  const createContractData = encodeFunctionData({
    abi: inProcessProtocolAbi,
    functionName: "createContract",
    args: [
      contractUri,
      collectionName,
      royaltyConfig,
      smartAccount.address, // defaultAdmin
      [], // setupActions
    ],
  });

  // Send the transaction
  const sendResult = await cdp.evm.sendUserOperation({
    smartAccount,
    network: IS_PROD ? "base" : "base-sepolia", // supported networks: https://docs.cdp.coinbase.com/api/docs/networks#network-identifiers
    paymasterUrl: process.env.CDP_PAYMASTER_URL,
    calls: [
      {
        to: IN_PROCESS_PROTOCOL_ADDRESS, // https://docs-in-process.vercel.app/protocol-deployments
        data: createContractData,
      },
    ],
  });

  // Wait for the transaction to be mined
  await cdp.evm.waitForUserOperation({
    smartAccountAddress: smartAccount.address,
    userOpHash: sendResult.userOpHash,
  });

  // Get the transaction details
  const userOp = await cdp.evm.getUserOperation({
    smartAccount,
    userOpHash: sendResult.userOpHash,
  });

  return {
    smartAccount,
    transactionHash: userOp.transactionHash,
  };
}

export default createCollection;
