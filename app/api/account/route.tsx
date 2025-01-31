import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";
import { getAccountByPhone } from "@/lib/supabase/getAccountByPhone";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const client = getSupabaseServerAdminClient();

  try {
    const { data: found } = await client
      .from("account_emails")
      .select("*")
      .eq("email", email)
      .single();
    if (found) {
      const { data: account } = await client
        .from("accounts")
        .select("*, account_info(*), account_emails(*)")
        .eq("id", found.account_id)
        .single();
      return Response.json(
        {
          data: {
            ...account.account_info[0],
            ...account.account_emails[0],
            ...account,
          },
        },
        { status: 200 }
      );
    }

    const { data: newAccount } = await client
      .from("accounts")
      .insert({
        name: "",
      })
      .select("*")
      .single();

    await client
      .from("account_emails")
      .insert({
        account_id: newAccount.id,
        email,
      })
      .select("*")
      .single();

    await client.from("credits_usage").insert({
      account_id: newAccount.id,
      remaining_credits: 1,
    });
    return Response.json(
      {
        data: {
          account_id: newAccount.id,
          email,
          image: "",
          instruction: "",
          organization: "",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get("phone");

    if (!phone) {
      return Response.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    try {
      const data = await getAccountByPhone(phone);
      return Response.json({ data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      // Return 404 for "No account found" message, 500 for other errors
      const status = message.includes("No account found") ? 404 : 500;
      return Response.json({ error: message }, { status });
    }
  } catch (error) {
    console.error("Error in /api/account:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
