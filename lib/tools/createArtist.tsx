import { z } from "zod";
import { tool } from "ai";
import { ArtistToolResponse } from "@/types/Tool";

const createArtist = (question: string) =>
  tool({
    description: `
    IMPORTANT: Always call this tool for ANY question related to creating artist:
    NOTE!!!: This feature will always run when prompted to create an artist, even if you don't get an artist name.
    Do NOT attempt to answer questions on these topics without calling this tool first!!!

    Example questions that MUST trigger this tool:
    - "Create a new artist."
    - "Create an artist."
    - "I wanna create a new artist."`,
    parameters: z.object({
      artist_name: z.string().describe("The name of the artist to be created."),
    }),
    execute: async ({ artist_name }) => {
      return {
        context: {
          status: ArtistToolResponse.CREATE_ARTIST,
          args: {
            artistName: artist_name,
          },
        },
        question,
      };
    },
  });

export default createArtist;
