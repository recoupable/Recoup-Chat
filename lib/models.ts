import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

import {
  customProvider,
  wrapLanguageModel,
  defaultSettingsMiddleware,
} from "ai";

// custom provider with different model settings:
export const myProvider = customProvider({
  languageModels: {
    "sonnet-3.7": wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: 5000 },
            },
          },
        },
      }),
      model: anthropic("claude-3-7-sonnet-20250219"),
    }),
    "grok-3-mini": xai("grok-3-mini"),
  },
  fallbackProvider: xai,
});

export type modelID = Parameters<(typeof myProvider)["languageModel"]>["0"];

export const models: Record<modelID, string> = {
  "sonnet-3.7": "Claude Sonnet 3.7",
  "grok-3-mini": "Grok 3 Mini",
};
