import { CdpClient } from "@coinbase/cdp-sdk";
import { type Address, encodeFunctionData } from "viem";

// ABI for the token contract (create function)
const tokenAbi = [
  {
    inputs: [
      { internalType: "string", name: "newContractURI", type: "string" },
      { internalType: "string", name: "name", type: "string" },
      {
        components: [
          {
            internalType: "uint32",
            name: "royaltyMintSchedule",
            type: "uint32",
          },
          { internalType: "uint32", name: "royaltyBPS", type: "uint32" },
          {
            internalType: "address",
            name: "royaltyRecipient",
            type: "address",
          },
        ],
        internalType: "struct ICreatorRoyaltiesControl.RoyaltyConfiguration",
        name: "defaultRoyaltyConfiguration",
        type: "tuple",
      },
      {
        internalType: "address payable",
        name: "defaultAdmin",
        type: "address",
      },
      { internalType: "bytes[]", name: "setupActions", type: "bytes[]" },
    ],
    name: "createContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

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
    abi: tokenAbi,
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
    network: "base-sepolia", // supported networks: https://docs.cdp.coinbase.com/api/docs/networks#network-identifiers
    paymasterUrl: process.env.CDP_PAYMASTER_URL,
    calls: [
      {
        to: "0x6832A997D8616707C7b68721D6E9332E77da7F6C" as Address, // Contract factory address
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
