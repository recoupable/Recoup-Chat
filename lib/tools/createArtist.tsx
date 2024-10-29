import { z } from "zod";
import { tool } from "ai";
import upsertArtist from "./upsertArtist";
import { ArtistToolResponse } from "@/types/Tool";

const createArtist = (question: string, email: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to creating artist.:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Create a new aritst"
    - "I wanna create a new artist."

    When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
    parameters: z.object({
      artist_name: z.string().describe("The name of the artist to be created."),
    }),
    execute: async ({ artist_name }) => {
      if (!artist_name)
        return {
          status: ArtistToolResponse.MISSING_ARTIST_NAME,
          context: {
            answer: "Please provide the artist name to proceed.",
          },
          question,
        };
      const data = await upsertArtist(artist_name, email);
      return {
        status: ArtistToolResponse.CREATED_ARTIST,
        context: {
          data: data,
        },
        question,
      };
    },
  });

export default createArtist;
