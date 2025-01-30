import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest, NextResponse } from "next/server";

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
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerAdminClient();

    // Query account_phone_numbers table to find matching account
    const { data: phoneData, error: phoneError } = await supabase
      .from("account_phone_numbers")
      .select("account_id")
      .eq("phone_number", phone)
      .single();

    if (phoneError) {
      // Handle "no results" case specifically
      if (phoneError.code === "PGRST116") {
        return NextResponse.json(
          { error: "No account found with this phone number" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Error querying phone number" },
        { status: 500 }
      );
    }

    // Get account details
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("id, email:account_emails(email)")
      .eq("id", phoneData.account_id)
      .single();

    if (accountError) {
      return NextResponse.json(
        { error: "Error fetching account details" },
        { status: 500 }
      );
    }

    // Extract email from the joined account_emails table
    const email = accountData?.email?.[0]?.email || null;

    return NextResponse.json({
      data: {
        id: accountData.id,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error in /api/account/lookup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
