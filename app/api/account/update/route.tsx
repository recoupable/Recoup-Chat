import { NextRequest } from "next/server";
import getAccountById from "@/lib/supabase/accounts/getAccountById";
import updateAccount from "@/lib/supabase/accounts/updateAccount";
import insertAccountInfo from "@/lib/supabase/accountInfo/insertAccountInfo";
import updateAccountInfo from "@/lib/supabase/accountInfo/updateAccountInfo";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { instruction, name, organization, accountId, image } = body;

  try {
    const found = await getAccountById(accountId);
    if (!found) {
      return Response.json({ data: null }, { status: 400 });
    }

    await updateAccount(accountId, { name });
    const account_info = found.account_info?.[0];
    if (!account_info) {
      await insertAccountInfo({
        organization,
        image,
        instruction,
        account_id: accountId,
      });
    } else {
      await updateAccountInfo(accountId, {
        organization,
        image,
        instruction,
      });
    }

    // Fetch the updated account with all joined info
    const updated = await getAccountById(accountId);
    return Response.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
