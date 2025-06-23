import { sendMessage } from "./sendMessage";
import { isTestEmail } from "@/lib/email/isTestEmail";

interface NewConversationNotificationParams {
  email: string;
  accountId: string;
  conversationId: string;
  topic: string;
  firstMessage?: string;
}

export const sendNewConversationNotification = async ({
  email,
  accountId,
  conversationId,
  topic,
  firstMessage,
}: NewConversationNotificationParams) => {
  // Skip sending for test emails
  if (isTestEmail(email)) return;

  try {
    const formattedMessage = `🗣️ New Conversation Started
From: ${email || accountId}
Chat ID: ${conversationId}
Topic: ${topic}
Time: ${new Date().toISOString()}${firstMessage ? `\n\nFirst Message:\n${firstMessage}` : ""}`;

    await sendMessage(formattedMessage);
  } catch (error) {
    console.error("Error sending new conversation notification:", error);
  }
};
