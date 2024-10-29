import { z } from "zod";
import { tool } from "ai";
import readArtists from "./readArtists";
import { ArtistToolResponse } from "@/types/Tool";

const getArtists = (question: string, email: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to regarding the artists I manage:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Which artists do I manage?"

    When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
    parameters: z.object({}),
    execute: async () => {
      const artists = await readArtists(email);
      return {
        context: {
          status: artists.length
            ? ArtistToolResponse.ARTIST_LIST
            : ArtistToolResponse.NO_ARTISTS,
          artists,
          question,
        },
      };
    },
  });

export default getArtists;
