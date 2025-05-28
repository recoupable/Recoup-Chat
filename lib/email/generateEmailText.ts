import generateText from "@/lib/ai/generateText";
import getAccountByEmail from "@/lib/supabase/accounts/getAccountByEmail";
import getAccountById from "@/lib/supabase/accounts/getAccountById";

/**
 * Generates a creative, context-aware email body for a recipient.
 * @param recipient - The name or email of the recipient (for greeting)
 * @param context - The context or original email content
 * @returns The generated email body as a string
 */
export async function generateEmailText(
  recipient: string,
  context: string
): Promise<string> {
  const system = `write a simple auto response email for inbound musician management request. 
from the company Recoup. 
only include the email body. 
If there's an original email, be sure to reference it in the response to show that you've read it and understand the request.
no headers or subject`;

  const greeting = recipient ? `Hi ${recipient},\n\n` : "Hi,\n\n";
  const prompt = context
    ? `original email: ${context}\n\nbe sure to include a greeting to the account name: ${recipient}`
    : greeting;
  try {
    const generated = await generateText({ system, prompt });
    return generated.text;
  } catch {
    return `${greeting}Thank you for reaching out to Recoup. We have received your message and will get back to you soon.`;
  }
}

/**
 * Looks up the account name for the given recipient email and generates the email text.
 * @param recipientEmail - The recipient's email address
 * @param context - The context or original email content
 * @returns The generated email body as a string
 */
export async function generateEmailTextForRecipient(
  recipientEmail: string,
  context: string
): Promise<string> {
  let accountName: string | null = null;
  try {
    if (recipientEmail) {
      const accountEmail = await getAccountByEmail(recipientEmail);
      if (accountEmail && accountEmail.account_id) {
        const account = await getAccountById(accountEmail.account_id);
        if (account && account.name) {
          accountName = account.name;
        }
      }
    }
  } catch {
    // ignore lookup errors, fallback to generic greeting
  }
  return generateEmailText(accountName || "", context);
}
