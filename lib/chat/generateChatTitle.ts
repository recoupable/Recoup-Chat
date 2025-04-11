import { AI_MODEL } from "@/lib/consts";
import OpenAI from "openai";

/**
 * Generates a brief, formal title (max 20 characters) based on the given question context.
 * Highlights segment names if present in the question.
 *
 * @param question - The question or context to generate a title for
 * @returns A promise that resolves to the generated title string
 */
export async function generateChatTitle(question: string): Promise<string> {
  const openai = new OpenAI();

  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "user",
        content: `Provide a brief title (more formal, no more than 20 characters!!!) that reflects the key elements of the given context.
        If the question is related to a segment or contains a segment name, highlight the segment name.
        Context: ${question}`,
      },
    ],
    store: true,
  });

  return response.choices[0].message!.content!.toString();
}
