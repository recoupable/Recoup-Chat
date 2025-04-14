import TelegramBot from "node-telegram-bot-api";
import telegramClient from "./client";

const MAX_MESSAGE_LENGTH = 4096; // Telegram's max message length

export const sendMessage = async (
  text: string,
  options?: TelegramBot.SendMessageOptions
): Promise<TelegramBot.Message> => {
  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID environment variable is required");
  }

  // Truncate message if it exceeds Telegram's limit
  const truncatedText =
    text.length > MAX_MESSAGE_LENGTH
      ? text.slice(0, MAX_MESSAGE_LENGTH - 3) + "..."
      : text;

  return telegramClient.sendMessage(
    process.env.TELEGRAM_CHAT_ID,
    truncatedText,
    options
  );
};
