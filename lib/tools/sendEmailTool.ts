import { z } from "zod";
import { tool } from "ai";
import sendEmail from "../email/sendEmail";
import { RECOUP_FROM_EMAIL } from "../consts";

const sendEmailTool = tool({
  description: `Send an email using the Resend API. Requires 'to' and 'subject'. Optionally include 'text', 'html', and custom headers.\n\nNotes:\n- Emails are sent from ${RECOUP_FROM_EMAIL}.\n- Use context to make the email creative and engaging.\n- Use this tool to send transactional or notification emails to users or admins.`,
  parameters: z.object({
    to: z
      .union([z.string().email(), z.array(z.string().email())])
      .describe("Recipient email address or array of addresses"),
    cc: z
      .union([
        z.string().email().transform((email) => [email]),
        z.array(z.string().email()),
      ])
      .optional()
      .describe(
        "Optional array of CC email addresses. active_account_email should always be included unless already in 'to'."
      ),
    subject: z.string().min(1).describe("Email subject line"),
    text: z
      .string()
      .optional()
      .describe(
        "Plain text body of the email. Use context to make this creative and engaging."
      ),
    html: z
      .string()
      .optional()
      .describe(
        "HTML body of the email. Use context to make this creative and engaging."
      ),
    headers: z
      .record(z.string(), z.string())
      .optional()
      .describe("Optional custom headers for the email"),
  }),
  execute: async ({ to, cc = [], subject, text, html, headers }: {
    to: string | string[];
    cc?: string[];
    subject: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>;
  }) => {
    try {
      const response = await sendEmail({
        from: RECOUP_FROM_EMAIL,
        to,
        cc: cc.length > 0 ? cc : undefined,
        subject,
        text,
        html,
        headers,
      });
      if (response && typeof response.json === "function") {
        const data = await response.json();
        if (response.ok) {
          return {
            success: true,
            message: `Email sent successfully from ${RECOUP_FROM_EMAIL} to ${to}. ${cc && cc.length > 0 ? `CC: ${JSON.stringify(cc)}` : "none"}.`,
            data,
          };
        } else {
          return {
            success: false,
            message:
              data?.error?.message ||
              `Failed to send email from ${RECOUP_FROM_EMAIL} to ${to}.`,
            data,
          };
        }
      }
      return {
        success: false,
        message: `Unknown error sending email from ${RECOUP_FROM_EMAIL} to ${to}.`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to send email from ${RECOUP_FROM_EMAIL} to ${to} for unknown reason.`,
      };
    }
  },
});

export default sendEmailTool;
