import stripeClient from "@/lib/stripe/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const successUrl = body.successUrl;
  const priceId = body.priceId;
  const referenceId = body.referenceId;
  const metadata = body.metadata;

  try {
    const session = await stripeClient.checkout.sessions.create({
      success_url: successUrl as string,
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": 1,
      mode: "payment",
      client_reference_id: referenceId,
      metadata,
    });

    return Response.json({ data: session }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
