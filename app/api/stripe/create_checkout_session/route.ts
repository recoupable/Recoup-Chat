export async function GET() {
  try {
    const session = {
      success_url: 'https://example.com/success',
      'line_items[0][price]': 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      'line_items[0][quantity]': 2,
      mode: 'payment'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const response = await fetch(`https://api.stripe.com/v1/payment_intents`, {
      method: "POST",
      body: new URLSearchParams(session).toString(),
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SK}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
