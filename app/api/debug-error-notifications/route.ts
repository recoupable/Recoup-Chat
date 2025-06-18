import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { serializeError } from "@/lib/errors/serializeError";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ? "SET" : "MISSING",
    telegramChatId: process.env.TELEGRAM_CHAT_ID ? "SET" : "MISSING",
    testResults: {
      telegramTest: "NOT_RUN",
      supabaseTest: "NOT_RUN",
      errorNotificationTest: "NOT_RUN"
    }
  };

  try {
    // Test 1: Direct Telegram API call
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `🔧 PRODUCTION DEBUG: Direct Telegram test from ${process.env.NODE_ENV} environment at ${results.timestamp}`,
            parse_mode: 'Markdown'
          })
        });
        
        const telegramResult = await telegramResponse.json();
        results.testResults.telegramTest = telegramResult.ok ? "SUCCESS" : "FAILED";
      } catch (error) {
        results.testResults.telegramTest = `ERROR: ${error instanceof Error ? error.message : "Unknown"}`;
      }
    } else {
      results.testResults.telegramTest = "SKIPPED: Missing credentials";
    }

    // Test 2: Full error notification system
    try {
      const testError = new Error("Production test error for debugging");
      await sendErrorNotification({
        email: 'production-test@example.com',
        roomId: 'production-test-room',
        accountId: 'production-test-account',
        error: serializeError(testError),
      });
      results.testResults.errorNotificationTest = "SUCCESS";
    } catch (error) {
      results.testResults.errorNotificationTest = `ERROR: ${error instanceof Error ? error.message : "Unknown"}`;
    }

    return Response.json(results, { status: 200 });
    
  } catch (error) {
    return Response.json({
      ...results,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 