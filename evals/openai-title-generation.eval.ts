import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";
import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI();

Eval("Real OpenAI Test", {
  data: () => [
    {
      input: "Create a 3-word title for: planning a music tour",
      expected: "Tour Planning Guide"
    },
    {
      input: "Create a 3-word title for: growing spotify streams", 
      expected: "Spotify Growth Tips"
    },
    {
      input: "Create a 3-word title for: building artist brand",
      expected: "Brand Building Guide"
    }
  ],
  task: async (input: string): Promise<string> => {
    try {
      // Real OpenAI call - should show tokens!
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: input
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      });

      return response.choices[0].message.content || "No response";
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'OpenAI call failed'}`;
    }
  },
  scores: [Levenshtein],
}); 