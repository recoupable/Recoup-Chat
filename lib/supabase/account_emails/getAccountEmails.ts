import serverClient from "../serverClient";
import { Tables } from "@/types/database.types";

type AccountEmail = Tables<"account_emails">;

export const getAccountEmails = async (
  accountId: string
): Promise<AccountEmail[]> => {
  const { data, error } = await serverClient
    .from("account_emails")
    .select("*")
    .eq("account_id", accountId);

  if (error) {
    console.error("Error fetching account emails:", error);
    throw error;
  }

  return data || [];
};
