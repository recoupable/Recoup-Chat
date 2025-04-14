import { z } from "zod";
import { tool } from "ai";
import { sendMessage } from "../telegram/sendMessage";

const schema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
  active_account_email: z.string().optional(),
  active_conversation_id: z.string().optional(),
  active_conversation_name: z.string().optional(),
});

const contactTeam = tool({
  description:
    "Send a message to the team. Use this when users need to contact support or have questions for the team.",
  parameters: schema,
  execute: async ({
    message,
    active_account_email,
    active_conversation_id,
    active_conversation_name,
  }) => {
    try {
      const formattedMessage = `🔔 New Team Contact
From: ${active_account_email || "Unknown"}
Chat: ${active_conversation_name || "No Chat Name"}
Chat ID: ${active_conversation_id || "No Chat ID"}
Time: ${new Date().toISOString()}

Message:
${message}`;

      await sendMessage(formattedMessage);

      return {
        success: true,
        message:
          "Your message has been sent to the team. They will review it and get back to you if needed.",
      };
    } catch (error) {
      console.error("Error sending team contact message:", error);
      return {
        success: false,
        message: "Failed to send message to team. Please try again later.",
      };
    }
  },
});

export default contactTeam;
