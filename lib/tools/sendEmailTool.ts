import { z } from "zod";
import { tool } from "ai";
import sendEmail from "../email/sendEmail";

const sendEmailTool = tool({
  description: `Send an email using the Resend API. Requires 'from', 'to', and 'subject'. Optionally include 'text', 'html', and custom headers.\n\nNotes:\n- The 'from' address must use the recoupable.com domain.\n- If not, it will fallback to hi@recoupable.com.\n- Use context to make the email creative and engaging.\n- Use this tool to send transactional or notification emails to users or admins.`,
  parameters: z.object({
    from: z
      .string()
      .email()
      .describe(
        "Sender email address (must be @recoupable.com; will fallback to hi@recoupable.com if not)"
      ),
    to: z
      .union([z.string().email(), z.array(z.string().email())])
      .describe("Recipient email address or array of addresses"),
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
  execute: async ({ from, to, subject, text, html, headers }) => {
    // Enforce recoupable.com domain for 'from' address
    let safeFrom = from;
    if (!/^[^@]+@recoupable\\.com$/i.test(from)) {
      safeFrom = "hi@recoupable.com";
    }
    try {
      const response = await sendEmail({
        from: safeFrom,
        to,
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
            message: `Email sent successfully from ${safeFrom} to ${to}.`,
            data,
          };
        } else {
          return {
            success: false,
            message:
              data?.error?.message ||
              `Failed to send email from ${safeFrom} to ${to}.`,
            data,
          };
        }
      }
      return {
        success: false,
        message: `Unknown error sending email from ${safeFrom} to ${to}.`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to send email from ${safeFrom} to ${to} for unknown reason.`,
      };
    }
  },
});

export default sendEmailTool;
