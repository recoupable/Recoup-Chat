import TelegramBot from "node-telegram-bot-api";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
}

const telegramClient = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

telegramClient.on("error", (error: Error) => {
  console.error("Telegram client error:", error);
});

export default telegramClient;
