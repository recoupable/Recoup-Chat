import { sendMessage } from "./sendMessage";

interface NewConversationNotificationParams {
  email: string;
  conversationId: string;
  topic: string;
  firstMessage?: string;
}

export const sendNewConversationNotification = async ({
  email,
  conversationId,
  topic,
  firstMessage,
}: NewConversationNotificationParams) => {
  try {
    const formattedMessage = `🗣️ New Conversation Started
From: ${email}
Chat ID: ${conversationId}
Topic: ${topic}
Time: ${new Date().toISOString()}${firstMessage ? `\n\nFirst Message:\n${firstMessage}` : ""}`;

    await sendMessage(formattedMessage);
  } catch (error) {
    console.error("Error sending new conversation notification:", error);
  }
};
