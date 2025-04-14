import TelegramBot from "node-telegram-bot-api";
import telegramClient from "./client";

export const sendMessage = async (
  text: string
): Promise<TelegramBot.Message> => {
  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID environment variable is required");
  }
  return telegramClient.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
};
