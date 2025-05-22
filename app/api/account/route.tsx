import { NextRequest } from "next/server";
import getAccountByEmail from "@/lib/supabase/accounts/getAccountByEmail";
import { getAccountByWallet } from "@/lib/supabase/accounts/getAccountByWallet";
import { insertAccountWallet } from "@/lib/supabase/accounts/insertAccountWallet";
import supabase from "@/lib/supabase/serverClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const wallet = body.wallet;

  try {
    // If wallet is provided, check account_wallets first
    if (wallet) {
      try {
        const account = await getAccountByWallet(wallet);
        return Response.json(
          {
            data: {
              ...account.account_info[0],
              ...account.account_emails[0],
              ...account.account_wallets[0],
              ...account,
            },
          },
          { status: 200 }
        );
      } catch (error) {
        console.log(
          "Wallet not found, checking email:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Continue to email check if wallet not found
      }
    }

    // If email is provided, check account_emails
    if (email) {
      try {
        const emailRecord = await getAccountByEmail(email);
        if (emailRecord) {
          const { data: account } = await supabase
            .from("accounts")
            .select("*, account_info(*), account_emails(*), account_wallets(*)")
            .eq("id", emailRecord.account_id)
            .single();

          if (account) {
            return Response.json(
              {
                data: {
                  ...account.account_info[0],
                  ...account.account_emails[0],
                  ...account.account_wallets[0],
                  ...account,
                },
              },
              { status: 200 }
            );
          }
        }
      } catch (error) {
        console.log(
          "Email not found, creating new account:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Continue to create new account if email not found
      }
    }

    // Create new account if neither wallet nor email found
    const { data: newAccount } = await supabase
      .from("accounts")
      .insert({
        name: "",
      })
      .select("*")
      .single();

    // Insert email if provided
    if (email) {
      await supabase
        .from("account_emails")
        .insert({
          account_id: newAccount.id,
          email,
        })
        .select("*")
        .single();
    }

    // Insert wallet if provided
    if (wallet) {
      await insertAccountWallet(newAccount.id, wallet);
    }

    await supabase.from("credits_usage").insert({
      account_id: newAccount.id,
      remaining_credits: 1,
    });

    return Response.json(
      {
        data: {
          account_id: newAccount.id,
          email: email || "",
          wallet: wallet || "",
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

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
