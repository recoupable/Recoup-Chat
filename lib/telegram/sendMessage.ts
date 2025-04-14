import TelegramBot from "node-telegram-bot-api";
import telegramClient from "./client";

export const sendMessage = async (
  chatId: string,
  text: string
): Promise<TelegramBot.Message> => {
  return telegramClient.sendMessage(chatId, text);
};
