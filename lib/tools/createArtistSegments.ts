import { z } from "zod";
import { tool } from "ai";
import { createArtistSegments } from "@/lib/segments/createArtistSegments";

const schema = z.object({
  artist_account_id: z
    .string()
    .min(
      1,
      "artist_account_id is required and should be pulled from the system prompt. Never request this from the user."
    ),
  prompt: z.string().min(1, "Prompt is required"),
});

const createArtistSegmentsTool = tool({
  description:
    "Create artist segments by analyzing fan data and generating segment names. This tool fetches all fans for an artist, generates segment names based on the provided prompt, and saves the segments to the database.",
  parameters: schema,
  execute: async ({ artist_account_id, prompt }) => {
    return await createArtistSegments({ artist_account_id, prompt });
  },
});

export default createArtistSegmentsTool;
